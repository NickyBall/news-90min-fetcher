var express = require('express');
var WPAPI = require('wpapi');
var router = express.Router();

router.post('/posttest', function(req, res, next) {
  res.end(req.body.name);
});

/* GET home page. */
router.post('/create', function(req, res, next) {
  var wp = new WPAPI({
    endpoint: 'https://next88.club/wp-json',
    // This assumes you are using basic auth, as described further below
    username: 'user',
    // password: 'yZxJ v2fs 0Djr VE9v xyoG T8It'
    password: 'jQjc!b^&6E1cT^*9JXAJ2&n2'
  });

  var content = `
  <div class="nm-embed" data-url="https://www.90min.com/${req.body.url}" data-embed-type="embed" data-show-date data-show-author>
    <div class="nm-embed-loader">
      <div class="spinner sk-circle">
        <div class="sk-circle1 sk-child"></div>
        <div class="sk-circle2 sk-child"></div>
        <div class="sk-circle3 sk-child"></div>
        <div class="sk-circle4 sk-child"></div>
        <div class="sk-circle5 sk-child"></div>
        <div class="sk-circle6 sk-child"></div>
        <div class="sk-circle7 sk-child"></div>
        <div class="sk-circle8 sk-child"></div>
        <div class="sk-circle9 sk-child"></div>
        <div class="sk-circle10 sk-child"></div>
        <div class="sk-circle11 sk-child"></div>
        <div class="sk-circle12 sk-child"></div>
      </div>
    </div>
    <div class="nm-embed-wrapper"></div>
      <a class="nm-embed-post" href="https://www.90min.com/${req.body.url}">
        ครบทุกชาติ ! รายชื่อ 23 คนสุดท้ายทั้ง 32 ทีม ที่นี่ที่เดียว
      </a>
    </div>
    <script defer src="https://static.minutemediacdn.com/assets/production/embed/v1.js"></script>
    <link href="https://static.minutemediacdn.com/assets/production/embed/styles.css" rel="stylesheet" type="text/css">
  `;

  wp.posts().create({
    title: req.body.title,
    content: content,
    status: 'publish'
  }).then(response => {
    res.json(response);
  }).catch(err => {
      res.json(err);
  });
});

module.exports = router;
