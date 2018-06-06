var express = require('express');
var router = express.Router();
var authMiddleware = require('../middlewares/auth');

/* GET home page. */
router.get('/', authMiddleware, function(req, res, next) {
  res.render('index', { username: req.session.username });
});

module.exports = router;
