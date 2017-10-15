import logging
from config import CrawlerConfig
from bs4 import BeautifulSoup
import urllib2
from models import Node, Edge, Crawler
from index import db
import multiprocessing

logging.basicConfig()


class DroCrawler():
    def __init__(self, rootUrl):
        self.name = rootUrl
        self.rootUrl = rootUrl
        self.logger = logging.getLogger(__name__)
        self.logger = None
        self.crawlerId = None
        try:
            # add crawler to db
            newCrawler = Crawler(definedDepth=3,
                                 reachedDepth=0,
                                 linksFound=0,
                                 rootUrl=rootUrl)
            db.session.add(newCrawler)
            db.session.commit()
            self.crawlerId = newCrawler.id
            self.logger = logging.getLogger(__name__ + '_' + str(self.crawlerId))
            self.logger.info('Crawler instance initiated.')

            # add root url node to db
            newNode = Node(url=rootUrl, level=0, crawlerId=newCrawler.id)
            db.session.add(newNode)
            db.session.commit()

        except Exception as e:
            db.session.rollback()
            self.logger.error("Could not add crawler to db")

    def startCrawl(self):
        service = multiprocessing.Process(name='crawler_' + str(self.crawlerId), target=self._crawl)
        service.start()

    def _crawl(self, rootUrl=None, depthLimit=CrawlerConfig.DEPTH, currentDepth=0):
        logger = self.logger
        if rootUrl is None:
            rootUrl = self.rootUrl
        fromNode = db.session.query(Node).filter(Node.url == rootUrl) \
                                         .filter(Node.crawlerId == self.crawlerId) \
                                         .first()

        if currentDepth >= depthLimit:
            return
        logger.info('current depth: ' + str(currentDepth))
        currentDepth += 1

        # parse page data for more urls
        urls = self._parse(url=rootUrl)
        if urls is None:
            return

        # recurse with new urls
        for url in urls:
            if url == rootUrl:
                continue

            # add record of neighbor node
            try:
                newNode = Node(url=url, level=currentDepth, crawlerId=self.crawlerId)
                db.session.add(newNode)
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                logger.error(str(e))

            # add edge
            toNode = db.session.query(Node).filter(Node.url == url) \
                                            .filter(Node.crawlerId == self.crawlerId) \
                                            .first()
            try:
                newEdge = Edge(target=toNode.id, source=fromNode.id, crawlerId=self.crawlerId)
                db.session.add(newEdge)
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                logger.error(str(e))

            # go deeper
            self._crawl(rootUrl=url, depthLimit=depthLimit, currentDepth=currentDepth)
        return

    def _parse(self, url):
        hrefList = []
        logger = self.logger
        logger.info('visiting [' + url + ']')
        try:
            conn = urllib2.urlopen(url)
            html = conn.read()
            soup = BeautifulSoup(html, "lxml")
            links = soup.find_all('a', href=True)
            foundCount = len(links)
            logger.info('found ' + str(foundCount) + ' links')

            for link in links:
                href = link['href']
                if not href.startswith('http'):
                    continue
                hrefList.append(href)
            hrefList = hrefList[:5]
        except Exception as e:
            logger.error(str(e))
        return hrefList
