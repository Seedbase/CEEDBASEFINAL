/*twitter strategies*/

var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../../models/usersModel');

module.exports = function(){

    passport.use(new TwitterStrategy({
        consumerKey: 'Qb50kQTJyJX8cAd9pMSs0KX1i',
        consumerSecret: 'CkY1dBzOJeXMRI1RrTl28VI53f0UzmtNg2HU56tokw2D0Is7dm',
        callbackURL: '/auth/twitter/callback',
        passReqToCallback: true
        },

        function(req, accessToken, refreshToken, profile, done){
            //query if user doesn't exist, if yes update the database of the user's info
            var user = {};
            var query = {'twitter.id' : profile.id};
            User.findOne(query, function(error, user) {
                if(user){
                    done(null, user);
                }
                else{
                    var user = new User;
                    user.provider = 'twitter';
                    user.displayName = profile.displayName;
                    user.isUserProfileActive = true;
                    // user.email = profile.emails[0].value;
                    user.image = profile._json.profile_image_url;

                    user.twitter = {};
                    user.twitter.id = profile.id;
                    user.twitter.token = accessToken;
                    user.providerId = profile.id;

                    user.save();
                    done(null, user);
                }
            });
        }
   ));
};
