var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {	
  	res.render('index', {users: users});
});

router.get('/error', function(req, res, next) {	
  	res.render('common-error.ejs');
});

module.exports = router;
