var http = require('http');
var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressWs = require('express-ws');

var app = express();

app.server = http.createServer(app);
const ews = expressWs(app, app.server);

var indexRouter = require('./routes/index');
var chatRouter = require('./routes/chat');

app.use(function (req, res, next) {
    req.ews = ews;
    return next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

app.use('/chat', chatRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
