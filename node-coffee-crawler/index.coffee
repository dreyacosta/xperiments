request = require 'request'
cheerio = require 'cheerio'
async   = require 'async'
util    = require 'util'

reddits     = ['node', 'javascript']
concurrency = 2

async.eachLimit reddits, concurrency, (reddit, next) ->
  url = util.format 'http://reddit.com/r/%s', reddit
  request url, (err, res, body) ->
    if err
      throw err
    $ = cheerio.load body
    $('a.title').each ->
      console.log '%s (%s)', $(this).text(), $(this).attr('href')
      next()