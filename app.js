var express = require('express');
var swig = require('swig');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var Cookies = require('cookies');


app.set('views', './views');
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(__dirname + '/public'));
swig.setDefaults({
	cache: false
});
app.use(bodyParser.urlencoded({
	extended: true
}));

// cookies设置
app.use(function(req, res, next) {
	req.cookies = new Cookies(req, res);
	// 解析登陆用户的cookies
	req.userInfo = {};

	if (req.cookies.get('userInfo')) {
		try {
			req.userInfo = JSON.parse(req.cookies.get('userInfo'))
		} catch (e) {}
	}
	//console.log(req.cookies.get('userInfo'))
	next();
});


//设置模块
app.use('/detail', require('./routers/detail'))
// 后台操作
app.use('/admin', require('./routers/admin'));
// 登录验证操作
app.use('/api', require('./routers/api'));
app.use('/login', require('./routers/login'));
app.use('/', require('./routers/main'));

mongoose.connect('mongodb://localhost:27020/nodeJS', function(err) {
	if (err) {
		console.log('数据库连接失败')
	} else {
		console.log('数据库连接成功');
		console.log('端口号为' + 8082);
		app.listen(8082);
	}
});