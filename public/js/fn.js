var fz = {
	select: function(obj, url, urlN, req, res, objnames) {
		var page = req.query.page || 1;
		var limit = 4;
		var pages = 0;

		obj.count().then(function(count) {

			pages = Math.ceil(count / limit);
			page = Math.min(page, pages);
			page = Math.max(page, 1);
			var skip = (page - 1) * limit;
			obj.find().limit(limit).skip(skip).then(function(objnames) {
				console.log(objnames)
				res.render(url, {
					userInfo: req.userInfo,
					limit: limit,
					pages: pages,
					page: page,
					objnames: objnames,
					count: count,
					urlname: urlN,
				})
			})

		})
	}
}
module.exports = fz;