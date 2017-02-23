var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var schedule = require('node-schedule');
var sql = require('mssql');
var FCM = require('fcm-push');

var serverKey = 'AIzaSyDS1dpbCanoJ8lMycvuyCaIizWSAn9sQW0';
var fcm = new FCM(serverKey);

var regTokens = 'fdR3PpS5-U0:APA91bExX-0ahwJQK6TSYkTd2xF4qM66kWiUv7Taj1QhfCy7FYubDYNJ2Hy-HjRKRtsLy3dRO9Q-LLyMXUGLSgLae90UaUK3ae9Rz3BpAcJA3kHc1kCXTlADwQDs4SM6Bt43md8kpptF';
 
var message = {
    to: regTokens, // required fill with device token or topics
    collapse_key: 'your_collapse_key', 
    data: {
        your_custom_data_key: 'your_custom_data_value'
    },
    notification: {
        title: 'Title of your push notification',
        body: 'Body of your push notification'
    }
};
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

 
var j = schedule.scheduleJob('* * * * *', function(){

console.log(1);
fcm.send(message, function(err, response){
    if (err) {
        console.log("Something has gone wrong!" , err);
    } else {
        console.log("Successfully sent with response: ", response);
    }
});
  
});

module.exports = app;
