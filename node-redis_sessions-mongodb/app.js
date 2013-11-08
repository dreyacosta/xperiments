var express = require('express'),
    routes  = require('./routes'),
    user    = require('./routes/user'),
    http    = require('http'),
    path    = require('path'),
    pass    = require('pwd');

var app = express();

var mongoose   = require('mongoose'),
    RedisStore = require('connect-redis')(express);

var functions = require('./routes/functions');

console.log(process.argv[2]);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('caaaaaat'));

app.use(express.session({
  store: new RedisStore({
    host: 'localhost',
    port: 6379,
    db: 'foo',
    ttl: 60000
  }),
  cookie: {maxAge: 60000},
  secret: '1234567890QWERTY'
}));

app.use(express.compress({
  filter: function(req, res) {
    return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
  },
  level: 9
}));

app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.status(404).render('404', {
    url: req.originalUrl,
    error: 'Not found'
  });
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

mongoose.connect('mongodb://localhost/redismongodb', function(err) {
  if (err) throw err;
});

var userSchema = mongoose.Schema({
  username: String,
  registerDate: {
      type: Date,
      default: Date.now
  },
  pass: String,
  salt: String
});
var User = mongoose.model('user', userSchema);

app.get('/', function(req, res) {
  res.render('index', {});
});

app.get('/register', function(req, res) {
  res.render('register', {});
});

app.post('/register', function(req, res) {
  var userdata = {};

  userdata.username = req.param('username');
  userdata.pass = req.param('pass');

  functions.registerUser(User, pass, userdata, res);
});

app.get('/login', function(req, res) {
  res.render('login', {session: req.session});
});

app.post('/login', function(req, res) {
  var userdata = {};

  userdata.username = req.param('username');
  userdata.pass = req.param('pass');

  functions.loginUser(User, pass, userdata, req, res);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});