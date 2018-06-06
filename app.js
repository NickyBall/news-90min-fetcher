var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');

// xml parser
var parseString = require('xml2js').parseString;

// db
// var MongoClient = require('mongodb').MongoClient;
// var uri = "mongodb+srv://nickyball:Ball123456@cluster0-qp8nd.mongodb.net/nodetest2?retryWrites=true";

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var newsRouter = require('./routes/news');
var wpRouter = require('./routes/wp');
var authRouter = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//db
var connection_string = "mongodb+srv://nickyball:Ball123456@cluster0-qp8nd.mongodb.net/news_fetcher";
mongoose.connect(connection_string);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

app.use(session({
  secret: 'login test',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.use(function(req,res,next) {
  // req.MongoClient = MongoClient;
  // req.uri = uri;
  req.parseString = parseString;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/news', newsRouter);
app.use('/wp', wpRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
