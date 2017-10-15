from index import db, bcrypt
from sqlalchemy import inspect
import json


class Crawler(db.Model):
    __tablename__ = 'crawler'
    id = db.Column(db.Integer(), primary_key=True)
    rootUrl = db.Column(db.String(255), unique=False, nullable=False)
    definedDepth = db.Column(db.Integer)
    reachedDepth = db.Column(db.Integer)
    linksFound = db.Column(db.Integer)


class Node(db.Model):
    __tablename__ = 'node'
    id = db.Column(db.Integer(), primary_key=True)
    url = db.Column(db.String(255), unique=False, nullable=False)
    level = db.Column(db.Integer(), nullable=False)
    crawlerId = db.Column(db.Integer(), db.ForeignKey('crawler.id'), nullable=False)
    __table_args__ = (db.UniqueConstraint('url', 'crawlerId', name='_url_crawlerId_uc'),
                      )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Edge(db.Model):
    __tablename__ = 'edge'
    id = db.Column(db.Integer(), primary_key=True)
    source = db.Column(db.Integer(), db.ForeignKey('node.id'), nullable=False)
    target = db.Column(db.Integer(), db.ForeignKey('node.id'), nullable=False)
    crawlerId = db.Column(db.Integer(), db.ForeignKey('crawler.id'), nullable=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class User(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))

    def __init__(self, email, password):
        self.email = email
        self.active = True
        self.password = User.hashed_password(password)

    @staticmethod
    def hashed_password(password):
        return bcrypt.generate_password_hash(password)

    @staticmethod
    def get_user_with_email_and_password(email, password):
        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password, password):
            return user
        else:
            return None
