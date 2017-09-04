var mongoose = require('mongoose');
module.exports = new mongoose.Schema({
	//	图片名称
	name: String,
	// 跳转地址
	url: String,
	//图片地址
	imgurl: String,
	//添加时间
	createTime: {
		type: Date,
		default: new Date()
	}
})