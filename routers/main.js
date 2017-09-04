var express = require('express');
var router = express.Router();
var Giser = require('../models/Giser');
var Img = require('../models/Img');
var Content = require('../models/Content');

//登陆
router.get('/', function(req, res) {

    var data = {
        page: Number(req.query.page || 1),
        userInfo: req.userInfo,
        gisers: [],
        imgs: [],
        limit: 8,
        pages: 0,
        arr3: [],
        arr2: [],
        arr4: []
    };
    Img.find().then(function(imgs) {
        data.imgs = imgs;
        return Img.count();
    })

    Giser.find().then(function(gisers) {
        data.gisers = gisers;
        return Content.count();

    }).then(function(count) {
        //console.log(count)
        data.count = count;
        data.limit = count;
        data.pages = Math.ceil(data.count / data.limit);
        data.page = Math.min(data.page, data.pages);
        data.page = Math.max(data.page, 1);
        var skip = (data.page - 1) * data.limit;
        return Content.find().sort({
            _id: -1
        }).limit(data.limit).skip(skip).populate(['contentID', 'user']);

    }).then(function(contents) {

        data.contents = contents;

        var newContent = contents;
        toArr(newContent, data, res);
    })

})

function toArr(arr, data, res) {

    //var arrBig = [];
    var arr2 = [];
    var arr3 = [];
    var arr4 = [];
    var arr5 = [];
    Giser.find().then(function(rs) {
        //console.log(rs)
        var arr3 = [];
        for (var i = 0; i < rs.length; i++) {
            //console.log(rs[i])
            arr3.push(rs[i].id);
        }
        //console.log(arr3)
        return arr3;
    }).then(function(rsArr) {
        //console.log(rsArr)
        var rsArr = rsArr;
        //console.log(arr);
        //console.log(arr.length)
        for (var i = 0; i < arr.length; i++) {
            //学校新闻
            //console.log(arr[i]);
            if (arr[i].contentID._id == "5834f6abb121e602d793fc7a") {
                arr2.push({
                    content: arr[i].content,
                    date: arr[i].addTime,
                    id: arr[i]._id,
                    title: arr[i].title
                });
            } else if (arr[i].contentID._id == "58328de992a5b7037e151c50") {
                //招生信息
                arr3.push({
                    content: arr[i].content,
                    date: arr[i].addTime,
                    id: arr[i]._id
                });
            } else if (arr[i].contentID._id == "5834f37f3c7d8302b0362a55") {
                //党建平台
                arr4.push({
                    content: arr[i].content,
                    date: arr[i].addTime,
                    id: arr[i]._id
                });
            } else if (arr[i].contentID._id == "58328d496f26730379866380") {
                //学校概况
                arr5.push({
                    title: arr[i].title,
                    date: arr[i].addTime,
                    id: arr[i]._id
                });
            }

        }
        data.arr2 = arr2;
        data.arr3 = arr3;
        data.arr4 = arr4;
        data.arr5 = arr5;
        console.log(arr2);
        res.render('main/index', data);
    })


}



module.exports = router;