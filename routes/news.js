var express = require('express');
const axios = require('axios');
let jsdom = require('jsdom').JSDOM;
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

module.exports = router;
