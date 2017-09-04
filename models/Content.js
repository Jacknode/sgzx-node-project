var mongoose = require('mongoose');
var ContentSchema = require('../schemas/contents');

module.exports = mongoose.model('Content',ContentSchema);
