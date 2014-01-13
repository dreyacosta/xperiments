# Scrapy settings for scrapylab project
#
# For simplicity, this file contains only the most important settings by
# default. All the other settings are documented here:
#
#     http://doc.scrapy.org/en/latest/topics/settings.html
#

BOT_NAME = 'scrapylab'

SPIDER_MODULES = ['scrapylab.spiders']
NEWSPIDER_MODULE = 'scrapylab.spiders'

# Crawl responsibly by identifying yourself (and your website) on the user-agent
#USER_AGENT = 'scrapylab (+http://www.yourdomain.com)'

# MongoDB pipeline for Scrapy
# https://github.com/sebdah/scrapy-mongodb
ITEM_PIPELINES = [
    'scrapy_mongodb.MongoDBPipeline',
]

MONGODB_URI = 'mongodb://localhost:27017'
MONGODB_DATABASE = 'scrapy'
MONGODB_COLLECTION = 'my_items'
MONGODB_UNIQUE_KEY = 'link'
MONGODB_ADD_TIMESTAMP = True