var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.render('main/login', {
		userInfo: req.userInfo
	})
})

module.exports = router;