from scrapy.contrib.spiders import CrawlSpider, Rule
from scrapy.contrib.linkextractors.sgml import SgmlLinkExtractor
from scrapy.selector import Selector

from scrapy.exceptions import DropItem

from scrapylab.items import ScrapylabItem

class ElPaisSpider(CrawlSpider):
    name = 'deportes'
    allowed_domains = ['deportes.elpais.com']
    start_urls = ['http://deportes.elpais.com']

    rules = (
        Rule(SgmlLinkExtractor(allow=('\/deportes/\d{4}/\d{2}/\d{2}/.*/.*.html', ), deny=('.*album.*|.*autoplay.*|.*videos.*',)), callback='parse_item'),
    )

    def parse_item(self, response):
        self.log('Hi, this is an item page! %s' % response.url)

        sel = Selector(response)
        item = ScrapylabItem()

        item['link'] = response.url
        item['title'] = sel.xpath('//h1[@id="titulo_noticia"]/text()')[0].extract()
        item['category'] = 'Deportes'

        noticia = sel.xpath('//*[@id="cuerpo_noticia"]')

        paragraphs = []

        for p in noticia.xpath('.//*/text()'):
            paragraphs.append(p.extract())

        item['content'] = ''.join(paragraphs)

        return item