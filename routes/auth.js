var express = require('express');
var User = require('../models/user');
var router = express.Router();

/* GET home page. */
router.post('/register', function(req, res, next) {
    if (req.body.email &&
      req.body.username &&
      req.body.password &&
      req.body.passwordConf) {
  
      var UserData = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        passwordConf: req.body.passwordConf,
      }
      User.create(UserData, function(err, user) {
        if (err) {
          return next(err);
        } else {
          console.log('insert success: ' + user);
          
          return res.redirect('/');
        }
      })
    }
  });
  
  router.get('/login', function(req, res, next) {
    res.render('login');
  });
  
  router.post('/login', function(req, res, next) {
    if (req.body.username && req.body.password) {
      User.authenticate(req.body.username, req.body.password, function (error, user) {
        if (error || !user) {
          var err = new Error('Wrong username or password.');
          err.status = 401;
          return next(err);
        } else {
          req.session.userId = user._id;
          req.session.username = user.username;
          return res.redirect('/');
        }
      });
    }
  });
  
  router.get('/logout', function(req, res, next) {
    if (req.session) {
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
  });

module.exports = router;