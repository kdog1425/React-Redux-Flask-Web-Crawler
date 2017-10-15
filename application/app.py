from flask import request, render_template, jsonify, url_for, redirect, g
from .models import User, Edge, Node
from index import app, db
from sqlalchemy.exc import IntegrityError
from .utils.auth import generate_token, requires_auth, verify_token
import logging, json
from crawler import DroCrawler
from flask_cors import *

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/<path:path>', methods=['GET'])
def any_root_path(path):
    return render_template('index.html')


@app.route("/api/crawler/", methods=["GET"])
@cross_origin()
def new_crawler():
    rootUrl = request.args.get('rootUrl', '')
    logger.info(rootUrl)
    if rootUrl is None or rootUrl is '':
        return jsonify(message='Must include <rootUrl> param!'), 400
    logger.info('handle request to crawl [' + rootUrl + ']')
    try: 
        crawler = DroCrawler(rootUrl)
        crawler.startCrawl()
    except Exception as e:
        logger.error(str(e))
        return jsonify({'error':'Something went wrong'}), 500
    return jsonify({'crawlerId': str(crawler.crawlerId),
                    'rootUrl': crawler.rootUrl})


@app.route("/api/crawler/<id>", methods=["GET"])
@cross_origin()
def get_crawler(id):
    logger.info('handle request to get crawler id [' + id + ']')
    edges = db.session.query(Edge).filter(Edge.crawlerId==id).all()
    nodeIds = set()
    for e in edges:
        fromNodeId = e.source
        toNodeId = e.target
        if fromNodeId not in nodeIds:
            nodeIds.add(fromNodeId)
        if toNodeId not in nodeIds:
            nodeIds.add(toNodeId)
    nodes = []
    for nodeId in nodeIds:
        node = db.session.query(Node).filter(Node.id==nodeId).one()
        nodes.append(node.as_dict())
    res_edges = [e.as_dict() for e in edges]
    return jsonify(edges=res_edges, nodes=nodes)

@app.route("/api/user", methods=["GET"])
@requires_auth
def get_user():
    return jsonify(result=g.current_user)


@app.route("/api/create_user", methods=["POST"])
def create_user():
    incoming = request.get_json()
    user = User(
        email=incoming["email"],
        password=incoming["password"]
    )
    db.session.add(user)

    try:
        db.session.commit()
    except IntegrityError:
        return jsonify(message="User with that email already exists"), 409

    new_user = User.query.filter_by(email=incoming["email"]).first()

    return jsonify(
        id=user.id,
        token=generate_token(new_user)
    )


@app.route("/api/get_token", methods=["POST"])
def get_token():
    incoming = request.get_json()
    user = User.get_user_with_email_and_password(incoming["email"], incoming["password"])
    if user:
        return jsonify(token=generate_token(user))

    return jsonify(error=True), 403


@app.route("/api/is_token_valid", methods=["POST"])
def is_token_valid():
    incoming = request.get_json()
    is_valid = verify_token(incoming["token"])

    if is_valid:
        return jsonify(token_is_valid=True)
    else:
        return jsonify(token_is_valid=False), 403

