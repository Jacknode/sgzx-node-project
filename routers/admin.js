var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Giser = require('../models/Giser');
var fz = require('../public/js/fn.js');
var Content = require('../models/Content')
var Detail = require('../models/Detail')
var Img = require('../models/Img')
var upload = require('../public/js/fileupload.js');


var userData = {
    code: 0,
    message: ''
}

router.get('/', function(req, res) {
    //console.log(req.userInfo)
    User.findOne({
        isAdmin: true
    }).then(function(data) {
        if (data) {
            res.render('admin/index', {
                userInfo: req.userInfo
            })
        } else {
            res.render('main/login')
        }

    })
})

// 用户首页
router.get('/user', function(req, res) {
        var users;

        fz.select(User, 'admin/user_index', 'user', req, res, users)
    })
    // 导航展示
router.get('/giser', function(req, res) {
    var gisers;
    fz.select(Giser, 'admin/giser_go', 'giser', req, res, gisers);
});
// 导航添加
router.get('/giser/add', function(req, res) {
    res.render('admin/giser_add');
})

router.post('/giser/add', function(req, res) {
    //console.log(req.body)
    var name = req.body.name;

    if (name == '') {
        userData.code = 1;
        userData.message = '导航名称不能为空';
        res.json(userData);
        return;
    }
    // 查询数据库中有没有分类名称一样的
    Giser.findOne({
        name: name
    }).then(function(rs) {
        if (rs) {
            userData.code = 2;
            userData.message = '导航名称已经存在';
            res.json(userData);
            return Promise.reject();
        } else {
            return new Giser({
                name: name
            }).save();
        }
    }).then(function(newGiser) {
        userData.code = 3;
        userData.message = '导航保存成功';
        res.json(userData);
        return;
    })
})

// 导航修改
router.get('/giser/update', function(req, res) {
    var id = req.query.id;
    //console.log(id)
    Giser.findOne({
        _id: id
    }).then(function(gisers) {
        //console.log(rs)
        //console.log(gisers)
        if (!gisers) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '修改的分类不存在'
            })

        } else {
            res.render('admin/giser_update', {
                userInfo: req.userInfo,
                gisers: gisers
            })
        }
    })
})

// 处理post提交过来的数据
router.post('/giser/update', function(req, res) {
    //console.log(req.query)
    var id = req.body.id || '';
    var name = req.body.name || '';
    Giser.findOne({
        _id: id
    }).then(function(gisers) {

        //console.log(gisers)
        if (!gisers) {
            userData.code = 1;
            userData.message = '修改的导航名称不存在';
            res.json(userData);
            return Promise.reject();

        } else {
            if (name == gisers.name) {
                userData.code = 2;
                userData.message = '修改成功';
                res.json(userData);
                return Promise.reject();
            } else {
                //判断数据库中是否存在该分类
                return Giser.findOne({
                    _id: {
                        $ne: id
                    },
                    name: name
                })
            }
        }
    }).then(function(result) {
        if (result) {
            userData.code = 3;
            userData.message = '数据库中已经存在同名导航';
            res.json(userData);
            return Promise.reject();
        } else {
            return Giser.update({
                _id: id
            }, {
                name: name
            })
        }
    }).then(function() {
        userData.code = 2;
        userData.message = '修改成功';
        res.json(userData);
        return Promise.reject();
    })
})

// 删除
router.post('/giser/delete', function(req, res) {
    var id = req.body.id || '';

    Giser.remove({
        _id: id
    }).then(function() {
        userData.code = 1;
        userData.message = '删除成功';
        res.json(userData);
        return Promise.reject();
    })
});

// 内容展示

router.get('/content', function(req, res) {
        var page = req.query.page || 1;
        var limit = 8;
        var pages = 0;

        Content.count().then(function(count) {

            pages = Math.ceil(count / limit);
            page = Math.min(page, pages);
            page = Math.max(page, 1);
            var skip = (page - 1) * limit;
            Content.find().sort({
                _id: -1
            }).limit(limit).skip(skip).populate(['contentID', 'user']).then(function(contents) {
                //console.log(contents)
                res.render('admin/content_index', {
                    userInfo: req.userInfo,
                    limit: limit,
                    pages: pages,
                    page: page,
                    contents: contents,
                    count: count,
                    urlname: 'content'
                })
            })

        })
    })
    // 内容添加
router.get('/content/add', function(req, res) {
    Giser.find().sort({
        _id: -1
    }).then(function(gisers) {
        //console.log(gisers)
        res.render('admin/content_add', {
            gisers: gisers,
            userInfo: req.userInfo
        })
    })
})


// 内容添加post

router.post('/content/add', function(req, res) {
        //console.log(req.body);
        var contentID = req.body.contentID || '';
        var title = req.body.title || '';
        var derection = req.body.derection || '';
        var content = req.body.content || '';

        if (title == '') {
            userData.code = 1;
            userData.message = '标题不能为空';
            res.json(userData);
            return;
        }
        if (derection == '') {
            userData.code = 1;
            userData.message = '简介不能为空';
            res.json(userData);
            return;
        }

        // 保存数据到数据库中
        new Content({
            contentID: contentID,
            title: title,
            user: req.userInfo._id.toString(),
            derection: derection,
            content: content
        }).save().then(function(rs) {
            userData.code = 2;
            userData.message = '添加成功';
            res.json(userData);
            return Promise.reject()
        })
    })
    // 内容修改
router.get('/content/update', function(req, res) {
        var id = req.query.id || '';
        var gisers;

        Giser.find().sort({
            _id: -1
        }).then(function(rs) {
            gisers = rs;
            return Content.findOne({
                _id: id
            })
        }).then(function(contents) {
            //console.log(contents)
            if (!contents) {
                userData.code = 1;
                userData.message = '要修改的内容不存在';
                res.json(userData);
                return Promise.reject();
            } else {
                res.render('admin/content_update', {
                    userInfo: req.userInfo,
                    contents: contents,
                    gisers: gisers
                })
            }
        })

    })
    // 内容修改post请求
router.post('/content/update', function(req, res) {
    //console.log(req.body)
    var id = req.body.id || '';
    var contentID = req.body.contentID || '';
    var title = req.body.title || '';
    var derection = req.body.derection || '';
    var content = req.body.content || '';

    if (title == '') {
        userData.code = 1;
        userData.message = '标题不能为空';
        res.json(userData);
        return;
    }
    if (derection == '') {
        userData.code = 1;
        userData.message = '简介不能为空';
        res.json(userData);
        return;
    }
    Content.update({
        _id: id
    }, {
        contentID: contentID,
        title: title,
        derection: derection,
        content: content
    }).then(function() {
        userData.code = 2;
        userData.message = '保存成功';
        res.json(userData);
        return Promise.reject();
    })

});

// 内容删除
router.post('/content/delete', function(req, res) {
    var id = req.body.id || '';

    Content.remove({
        _id: id
    }).then(function() {
        userData.code = 1;
        userData.message = '删除成功';
        res.json(userData);
        return Promise.reject();
    })

});

//图片添加
router.get('/img/add', function(req, res) {
    res.render('admin/img_add', {
        userInfo: req.userInfo
    })
});

// 图片添加post

router.post('/img/add', upload.single('avatar'), function(req, res) {
    var name = req.body.name || '';
    var url = req.body.url || '';
    if (name == '') {
        userData.code = 1;
        userData.message = '图片名称不能为空';
        res.json(userData);
        return;
    }
    if (url === '') {
        userData.code = 2;
        userData.message = '跳转地址不能为空';
        res.json(userData);
        return;
    }
    if (imgurl === '') {
        userData.code = 3;
        userData.message = '图片地址不能为空';
        res.json(userData);
        return;
    }
    if (req.file) {
        var imgurl = '/public/uploads/' + req.file.filename || '';
        console.log(req.file.filename)
        new Img({
            name: name,
            url: url,
            imgurl: imgurl
        }).save().then(function() {
            res.render('admin/succees', {
                message: "保存成功",
                url: '/admin/img'
            })
        });
    }

});

// 图片展示
router.get('/img', function(req, res) {
    var page = req.query.page || 1;
    var limit = 8;
    var pages = 0;

    Img.count().then(function(count) {

        pages = Math.ceil(count / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        Img.find().sort({
            _id: -1
        }).limit(limit).skip(skip).then(function(imgs) {
            //console.log(contents)
            res.render('admin/img_index', {
                userInfo: req.userInfo,
                limit: limit,
                pages: pages,
                page: page,
                imgs: imgs,
                count: count,
                urlname: 'img'
            })
        })

    })
});

// 图片修改

router.get('/img/update', function(req, res) {
    var id = req.query.id || '';

    Img.findOne({
        _id: id
    }).then(function(imgs) {
        //console.log(imgs)
        if (!imgs) {
            userData.code = 1;
            userData.message = '要修改的图片不存在';
            res.json(userData);
            return Promise.reject();
        } else {
            res.render('admin/img_update', {
                userInfo: req.userInfo,
                imgs: imgs
            })
        }

    })

});

// 图片修改post

router.post('/img/update', function(req, res) {
    // console.log(req.body)
    var name = req.body.name || '';
    var url = req.body.url || '';
    var imgurl = req.body.imgurl || '';
    var id = req.body.id || '';

    if (name == '') {
        userData.code = 1;
        userData.message = '图片名称不能为空';
        res.json(userData);
        return;
    }
    if (url === '') {
        userData.code = 2;
        userData.message = '跳转地址不能为空';
        res.json(userData);
        return;
    }
    if (imgurl === '') {
        userData.code = 3;
        userData.message = '图片地址不能为空';
        res.json(userData);
        return;
    }

    Img.update({
        _id: id
    }, {
        name: name,
        url: url,
        imgurl: imgurl
    }).then(function(rs) {
        userData.code = 4;
        userData.message = '修改成功';
        res.json(userData);
        return Promise.reject();
    })

});

// 图片删除
router.post('/img/delete', function(req, res) {
    var id = req.body.id || '';

    Img.remove({
        _id: id
    }).then(function() {
        userData.code = 1;
        userData.message = '删除成功';
        res.json(userData);
        return Promise.reject();
    })
})


//详情页面管理
router.get('/details/add', function(req, res) {
    Content.find().sort({
        _id: -1
    }).then(function(contents) {
        res.render('admin/detail_add', {
            contents: contents,
            userInfo: req.userInfo
        })
    })
});


//详情页面添加功能
router.post('/details/detail/add', function(req, res) {
    console.log(req.body)
    var title = req.body.title;
    var derection = req.body.derection;
    var content = req.body.content;

    if (title == '') {
        userData.code = 1;
        userData.message = '详情标题不能为空';
        res.json(userData);
        return;
    }
    if (derection == '') {
        userData.code = 1;
        userData.message = '详情简介不能为空';
        res.json(userData);
        return;
    }
    if (content == '') {
        userData.code = 3;
        userData.message = '详情内容不能为空';
        res.json(userData);
        return;
    }
    new Detail({
        title: title,
        derection: derection,
        content: content
    }).save().then(function() {
        userData.code = 4;
        userData.message = '添加成功';
        res.json(userData);
        return Promise.reject();
    })


    // console.log(body);
})

//详情页面展示
router.get('/details', function(req, res) {
    var page = req.query.page || 1;
    var limit = 8;
    var pages = 0;

    Detail.count().then(function(count) {

        pages = Math.ceil(count / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        Detail.find().sort({
            _id: -1
        }).limit(limit).skip(skip).populate(['contentID', 'user']).then(function(details) {
            res.render('admin/detail_index', {
                userInfo: req.userInfo,
                limit: limit,
                pages: pages,
                page: page,
                details: details,
                count: count,
                urlname: 'detail'
            })
        })
    })
});

//详情删除
router.post('/details/delete', function(req, res) {
    var id = req.body.id;
    console.log(req.body);
    Detail.remove({
        _id: id
    }).then(function() {
        userData.code = 1;
        userData.message = '删除成功';
        res.json(userData);
        return Promise.reject();
    })
});



module.exports = router;