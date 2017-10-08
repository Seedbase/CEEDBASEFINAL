var express = require('express');
var router = express.Router();

/* GET users listing. */ 
router.use('/client-form', function(req, res) {
	res.render('clientForm.ejs');
});

module.exports = router;
