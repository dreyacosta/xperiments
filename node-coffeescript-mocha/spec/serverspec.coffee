expect = require('chai').expect
request = require 'supertest'
app = require '../index.coffee'

describe 'Testing with mocha and coffeescript', ->
  it 'should be a text/html', (done) ->
    request app
      .get '/'
      .end (err, res) ->
        expect(res.type).to.equal 'text/html'
        done()
  it 'should return Hello World', (done) ->
    request app
      .get '/'
      .end (err, res) ->
        expect(res.text).to.equal 'Hello World'
        done()