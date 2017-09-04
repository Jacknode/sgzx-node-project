var mongoose = require('mongoose');
var giserSchema = require('../schemas/imgs');

module.exports = mongoose.model('Img',giserSchema);