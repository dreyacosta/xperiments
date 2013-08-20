var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

var mongoose = require('mongoose');
var RedisStore = require('connect-redis')(express);
var pass = require('pwd');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session({
  store: new RedisStore({
    host: 'localhost',
    port: 6379,
    db: 'foo',
    ttl: 10000
  }),
  cookie: {maxAge: 10000},
  secret: '1234567890QWERTY'
}));
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

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

var loginUser = function(userData, req, res) {
  User.findOne({username: userData.username}, function (err, user) {
    if (err) throw err;
    console.log(user);
    pass.hash(userData.pass, user.salt, function(err, hash){
      if (user.pass == hash) {
        console.log('Enter to hash');
        req.session.regenerate(function(){
          req.session.username = user.username;
          res.redirect('/login');
        });
      }
    });
  });
}

var registerUser = function(userData, res) {
  var user = new User();

  pass.hash(userData.pass, function(err, salt, hash){
    user.salt = salt;
    user.pass = hash;

    user.username = userData.username;

    user.save();

    res.redirect('/');
  });
}

var registerForm = function(req, res) {
  var userData = {};

  userData.username = req.param('username');
  userData.pass = req.param('pass');

  registerUser(userData, res);
}

app.post('/register', registerForm);

app.get('/register', function(req, res) {
  res.render('register', {});
});

var loginForm = function(req, res) {
  var userData = {};

  userData.username = req.param('username');
  userData.pass = req.param('pass');

  loginUser(userData, req, res);
}

app.post('/login', loginForm);

app.get('/login', function(req, res) {
  res.render('login', {session: req.session});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});