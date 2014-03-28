http = require 'http'
path = require 'path'
express = require 'express'

app = express()

app.set 'port', process.env.PORT || 3000

if 'development' is app.get('env')
  app.use express.errorHandler()

app.get '/', (req, res) ->
  res.send 'Hello World'

server = http.createServer app

server.listen app.get('port'), ->
  console.log 'Listen on port 3000'

module.exports = app