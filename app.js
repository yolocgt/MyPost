var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var post = require('./routes/post');
var user = require('./routes/user');
var reply = require('./routes/reply');

var app = express();

// view engine setup
app.engine('html', require('express-art-template'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/post', post);
app.use('/api/v1/user', user);
app.use('/api/v1/reply', reply);

app.get('/',function(req,res){
	res.redirect('/views/user/index.html')
})

module.exports = app;
