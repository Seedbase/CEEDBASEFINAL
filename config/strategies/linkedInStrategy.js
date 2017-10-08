/*google strategies*/

var passport = require('passport');
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var User = require('../../models/usersModel');

module.exports = function(){

    passport.use(new LinkedInStrategy({
         clientID: "86vio4512bfo3w",
         clientSecret: "JHg3spoUtLM9qTQ6",
         callbackURL: "/auth/linkedin/callback"
        //  scope: ['r_emailaddress', 'r_basicprofile'],
        //  state: true,
        },

        function(req, accessToken, refreshToken, profile, done){
            //query if user doesn't exist, if yes update the database of the user's info
            var user = {};
            var query = {'linkedin.id' : profile.id};

            User.findOne(query, function(error, user){
                if(user){
                    done(null, user);
                }
                else{
                    var user = new User;
                    user.provider = 'linkedin';
                    user.isUserProfileActive = true;
                    user.displayName = profile.displayName;
                    user.email = (profile.emails && profile.emails[0])? profile.emails[0].value : '';
                    user.image = (profile.photos && profile.photos[0]) ? profile.photos[0].value : 'images/profile/avatar.jpg';

                    user.linkedIn = {};
                    user.linkedIn.id = profile.id;
                    user.linkedIn.token = accessToken;
                    user.providerId = profile.id;
                    user.save();
                    done(null, user);
                }
            });
        }
    ));
};
