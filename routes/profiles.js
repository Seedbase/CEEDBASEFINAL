var express = require('express');
var router = express.Router();
var User = require('../models/usersModel');
/* GET users listing. */ 
router.use('/profile', function(req, res) {
	if (req.user) {
		User.findOne({_id: req.user._id}, function (err, user) {
			if(err)
				res.render('common-error', {error: 'Creative profile is already authenticated'});
			else
				res.render('profile.ejs' , {user:user});
		})
	}
	
});

router.use('/profile/authentication', function(req, res) {
  res.render('profile-authentication.ejs' , {user:user});
});

router.use('/profile/view', function (req, res) {
	res.render('profile-view.ejs' , {user:user});
});

router.use('/profile/interest', function (req, res) {
	res.render('profile-interest.ejs' , {user:user});
})



module.exports = router;
