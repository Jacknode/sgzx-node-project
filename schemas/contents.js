var mongoose = require('mongoose');
module.exports = new mongoose.Schema({

	//	关联字段 －－内容id
	contentID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Giser'
	},
	//添加时间
	addTime: {
		type: Date,
		default: new Date()
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	//	标题
	title: String,
	//	简介
	derection: {
		type: String,
		default: ''
	},
	//	内容
	content: {
		type: String,
		default: ''
	}

});