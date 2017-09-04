var mongoose = require('mongoose');
var giserSchema = require('../schemas/gisers');

module.exports = mongoose.model('Giser',giserSchema);