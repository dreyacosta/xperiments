module.exports = {
  loginUser: function(User, pass, userdata, req, res) {
    User.findOne({username: userdata.username}, function (err, user) {
      
      if (err) throw err;
    
      pass.hash(userdata.pass, user.salt, function(err, hash){
        if (user.pass == hash) {
          req.session.regenerate(function(){
            req.session.username = user.username;
            res.redirect('/login');
          });
        }
      });

    });
  },
  
  registerUser: function(User, pass, userdata, res) {
    var user = new User();

    pass.hash(userdata.pass, function(err, salt, hash){
      user.salt = salt;
      user.pass = hash;
      user.username = userdata.username;

      user.save();

      res.redirect('/');
    });
  }
}