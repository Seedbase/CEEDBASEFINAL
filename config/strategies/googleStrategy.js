/*google strategies*/

var passport = require('passport');
var OAuth2Strategy = require( 'passport-google-oauth2' ).Strategy;
var User = require('../../models/usersModel');

module.exports = function(){

    passport.use(new OAuth2Strategy({
        clientID: '955919761436-ri32fclpplgd5f5cj70vm4r2mffffpcn.apps.googleusercontent.com',
        clientSecret: '7VT8R7WzrmALnIG2zFfhHpE9',
        callbackURL: '/auth/google/callback',
        passReqToCallback: true
    },
        function(req, accessToken, refreshToken, profile, done) {
            //query if user doesn't exist, if yes update the database of the user's info
            var user = {};
            var query = {'google.id' : profile.id};

            User.findOne(query, function(error, user){
                if(user){
                    done(null, user);
                }
                else{
                    var user = new User;
                    user.provider = 'google';
                    user.isUserProfileActive = true;
                    user.displayName = profile.displayName;
                    user.email = (profile.emails && profile.emails[0]) ? profile.emails[0].value : '';
                    user.image = (profile.photos && profile.photos[0]) ? profile.photos[0].value : 'images/profile/avatar.jpg';

                    user.google = {};
                    user.google.id = profile.id;
                    user.google.token = accessToken;
                    user.providerId = profile.id;
                    user.save();
                    done(null, user);
                }
            });
        }
    ));
};
