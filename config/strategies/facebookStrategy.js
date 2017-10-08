/*facebook strategies*/

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
var User = require('../../models/usersModel');

module.exports = function() {

    passport.use(new FacebookStrategy({
        clientID: '136609566974631',
        clientSecret: 'c8bd30f5a84984301bfa11e515fe1681',
        callbackURL: "http://13.126.94.217:3002/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email'],
        passReqToCallback: true
    },
        function(req, accessToken, refreshToken, profile, done) {
            //query if user doesn't exist, if yes update the database of the user's info
            var user = {};
            var query = {'facebook' : profile.id};

            User.findOne(query, function(error, user){
                if(user){
                    return done(null, user);
                }
                else{
                    var user = new User;
                    user.provider = 'facebook';
                    user.isUserProfileActive = true;
                    user.displayName = profile.displayName;
                    user.email = (profile.emails && profile.emails[0]) ? profile.emails[0].value : 'images/profile/avatar.jpg';
                    user.image = profile._json.picture.data.url;

                    user.facebook = {};
                    user.facebook.id = profile.id;
                    user.facebook.token = accessToken;
                    user.providerId = profile.id;
                    user.save(function () {
                        return done(null, user);
                    });
                   
                    }
            });
        }
    ));
};
