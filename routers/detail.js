let express = require('express');
let router = express.Router();
var Detail = require('../models/Detail');


router.get('/news', (req, res) => {
	console.log(req.query)
	let id = req.query.id;

	Detail.findOne({
		id: id
	}).then((result) => {
		console.log(result)
		if (result) {
			res.render('main/details', {
				deatil: result
			});
		}
	})

})

module.exports = router;