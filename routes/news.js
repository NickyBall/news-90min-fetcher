var express = require('express');
const axios = require('axios');
let jsdom = require('jsdom').JSDOM;
var News = require('../models/news');
var router = express.Router();

/* GET news listing. */
router.get('/fetch', function(req, res, next) {
    var parseString = req.parseString;

    axios.get('https://www.90min.com/th/posts.rss').then(response => {

        var data = response.data;
        parseString(data, function(err, result) {
            res.json(result.rss.channel[0].item);
        });
    }).catch(err => {
        console.log(err);
    });
});

/* GET news listing. */
router.get('/top', function(req, res, next) {
    var parseString = req.parseString;

    axios.get('https://www.90min.com/th/top-stories?page='+req.query.page).then(response => {
        var data = response.data;
        let dom = new jsdom(data);
        var result = [];
        var articles = dom.window.document.querySelectorAll('div.feedpage-article');
        
        articles.forEach(function(article, index) {
            var item = {};
            var url = article.querySelector('a.feedpage-article__thumbnail-wrapper');
            item.url = url.getAttribute('href');
            
            var img = article.querySelector('img.feedpage-article__thumbnail');
            item.thumbnail = img.src;

            var data = article.querySelector('div.feedpage-article__data');

            var title = data.querySelector('a.feedpage-article__title');
            var description = data.querySelector('a.feedpage-article__description');
            var author = data.querySelector('a.feedpage-article__author-link');

            item.title = title.innerHTML;
            item.desc = description.innerHTML;
            item.author = author.innerHTML;

            result.push(item);
        });
        
        res.json(result);

    }).catch(err => {
        console.log(err);
    });
});

router.post('/create', function(req, res, next) {
    if (req.body.url) {
        var NewsData = {
            url: req.body.url
        }
        News.create(NewsData, function(err, result) {
            if (err) {
                res.json({
                    status: 400
                });
            } else {
                res.json({
                    status: 200
                });
            }
        });
    } else {
        res.json({
            status: 400
        });
    }
});

router.get('/check', function (req, res, next) {
    if (req.query.url) {
        News.findOne({ url: req.query.url }).exec(function (err, data) {
            if (err) {
                res.json({
                    status: 400
                });
            } else {
                if (data) {
                    res.json({
                        status: 200,
                        data: data
                    });
                } else {
                    res.json({
                        status: 404
                    });
                }
            }
        })
    } else {
        res.json({
            status: 400
        });
    }
});

module.exports = router;
