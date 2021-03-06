var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');


var index = require('./routes/index');


var app = express();

// model variables
var User = require('./models/user.js');
var Recipe = require('./models/recipe.js');

// mongoose
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

//connect to database
mongoose.connect('mongodb://kathrynwood:Clover24**@ds161018.mlab.com:61018/whatsinyourfridge');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'test cookie',
				  cookie: { maxAge: 30*24*60*60*1000 },
				  resave: true,
				  saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// REQUIRE passport strategy config files. (link them)
var passportApplyConfig = require('./passport/passport.js');
passportApplyConfig(passport);

// USE function to set global.user (logged in user);
app.use(function (req, res, next) {
	global.currentUser = req.user;
	next();
});

// server route
app.use('/', index);




// required for passport
app.use(session({ secret: 'Makin too much money!'}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// This middleware will allow us to use the currentUser in our views and routes.
app.use(function (req, res, next) {
  global.currentUser = req.user;
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
