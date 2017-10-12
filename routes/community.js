var express = require('express');
var router = express.Router();
var User = require('../models/usersModel');
/* GET users listing. */ 
router.use('/community', function(req, res) {
	res.render('community.ejs');
});

module.exports = router;
