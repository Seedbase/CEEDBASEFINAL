var passport = require('passport');

module.exports = function(app){

  app.use(passport.initialize());
  app.use(passport.session());

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
      done(null, user);
     // where is this user.id going? Are we supposed to access this anywhere?
  });

  // used to deserialize the user
  passport.deserializeUser(function(user, done) {
      done(null, user);
  });

  require('./strategies/googleStrategy')();
  require('./strategies/twitterStrategy')();
  require('./strategies/facebookStrategy')();
  require('./strategies/linkedInStrategy')();

};
