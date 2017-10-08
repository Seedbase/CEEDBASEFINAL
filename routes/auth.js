//authenticate the google account

var express = require('express');
var router = express.Router();
var passport = require('passport');

//google routes
router.route('/google/callback').get(passport.authenticate('google', {
      successRedirect:'/profile',
      failure:'/#',
}));

/*router.route('/google').get(passport.authenticate('google', { scope:['profile','email']
}));
*/
router.route('/google').get(passport.authenticate('google', {scope: [
      'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/plus.profile.emails.read' ]
}));
//twitter routes
router.route('/twitter/callback').get(passport.authenticate('twitter', {
      successRedirect:'/profile',
      failure:'/#',
}));

router.route('/twitter').get(passport.authenticate('twitter', {scope:['profile','email']}));


//facebook routes
router.route('/facebook/callback').get(passport.authenticate('facebook', {
      successRedirect:'/profile',
      failure:'/#',
}));

//linkedIn routes
router.route('/facebook').get(passport.authenticate('facebook',{scope:['email']}));

//facebook routes
router.route('/linkedIn/callback').get(passport.authenticate('linkedin', {
      successRedirect:'/profile',
      failure:'/#',
}));

router.route('/linkedIn').get(passport.authenticate('linkedin',{ state: 'SOME STATE', scope: ['r_emailaddress', 'r_basicprofile']}));


module.exports = router;
