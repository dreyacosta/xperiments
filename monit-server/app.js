
/**
 * Module dependencies.
 */

var express = require('express'),
    routes  = require('./routes'),
    user    = require('./routes/user'),
    http    = require('http'),
    os      = require('os'),
    path    = require('path');

var app     = express(),
    server  = http.createServer(app),
    io      = require('socket.io').listen(server);

console.log(os.freemem());
console.log(os.loadavg()[0]);

// all environments
app.configure(function() {
    app.set('port', process.env.PORT || 3001);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({secret: 'monkey'}));
    app.use(app.router);
    app.use(require('stylus').middleware(__dirname + '/public'));
    app.use(express.static(path.join(__dirname, 'public')));
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

setInterval(function(){
  var stats = {};
  var newDate = new Date();
  stats.date = newDate.getHours() + ":" + newDate.getMinutes() + ":" + newDate.getSeconds();
  stats.mem = os.freemem();
  io.sockets.emit('monit', stats);
}, 1000);

app.get('/', routes.index);
app.get('/users', user.list);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});