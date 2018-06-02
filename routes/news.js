var express = require('express');
const axios = require('axios');
var router = express.Router();

/* GET news listing. */
router.get('/fetch', function(req, res, next) {
    var parseString = req.parseString;
    // var xml = "<root>Hello xml2js!</root>";
    // parseString(xml, function (err, result) {
    //     console.log(result);
    // });
    axios.get('https://www.90min.com/th/posts.rss').then(response => {
        // console.log(res.data);
        var data = response.data;
        parseString(data, function(err, result) {
            // console.log(JSON.stringify(result));
            res.json(result.rss.channel[0].item);
        });
    }).catch(err => {
        console.log(err);
    });
});

module.exports = router;
