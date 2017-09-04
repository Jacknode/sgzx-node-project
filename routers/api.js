var express = require('express');
var router = express.Router();
var User = require('../models/User');

var userData = {
	code: 0,
	message: ''
}
router.get('/ceshi', function(req, res) {
	userData.code = 1;
	userData.message = '修改成功';
	res.json(userData);
	return;
})

router.post('/user/login', function(req, res) {
	//console.log(req.body);
	var username = req.body.username;
	var password = req.body.password;
	var repassword = req.body.respassword;

	if (username == '') {
		userData.code = 1;
		userData.message = '用户名不能为空';
		res.json(userData);
		return;
	}
	if (password == '') {
		userData.code = 2;
		userData.message = '密码不能为空';
		res.json(userData);
		return;
	}

	if (password != repassword) {
		userData.code = 3;
		userData.message = '密码和重复密码不一致';
		res.json(userData);
		return;
	}

	User.findOne({
		username: username
	}).then(function(rs) {
		if (rs) {
			userData.code = 4;
			userData.message = '用户名已经被注册了，请重新注册';
			res.json(userData);
			return;
		}
		var user = new User({
			username: username,
			password: password,
			repassword: repassword,
			isAdmin: true
		});
		return user.save();
	}).then(function() {
		userData.message = '注册成功';
		res.json(userData);
	})

})



router.post('/user/submit', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;

	if (username == '' || password == '') {
		userData.code = 1;
		userData.message = '用户名或密码不能为空';
		res.json(userData);
		return;
	}
	User.findOne({
		username: username,
		password: password,
		isAdmin: true
	}).then(function(userInfo) {
		if (!userInfo) {
			userData.code = 2,
				userData.message = '用户名或密码错误';
			res.json(userData);
			return;
		}
		//console.log(rs);
		userData.message = '登陆成功';
		userData.userInfo = {
			_id: userInfo._id,
			username: userInfo.username
		}

		req.cookies.set('userInfo', JSON.stringify({
			_id: userInfo._id,
			username: userInfo.username
		}));
		//console.log(req.userInfo)
		res.json(userData);
	})
})

router.get('/user/laydown', function(req, res) {
	req.cookies.set('userInfo', null);
	res.json(userData);
})

module.exports = router;