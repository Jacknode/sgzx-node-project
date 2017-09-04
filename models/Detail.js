var mongoose = require('mongoose');
var DetailSchema = require('../schemas/details');

module.exports = mongoose.model('Detail', DetailSchema);