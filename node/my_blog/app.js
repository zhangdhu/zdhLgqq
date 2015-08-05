// Generated by CoffeeScript 1.7.1
(function() {
  var MongoStore, accessLog, app, bodyParser, cookieParser, debug, errorLog, express, favicon, flash, fs, logger, path, routes, server, session, settings;

  express = require('express');

  fs = require('fs');

  path = require('path');

  favicon = require('static-favicon');

  cookieParser = require('cookie-parser');

  session = require('express-session');

  flash = require('connect-flash');

  bodyParser = require('body-parser');

  MongoStore = require('connect-mongo')(session);

  settings = require('./settings');

  logger = require('morgan');

  debug = require('debug')('blog');

  accessLog = fs.createWriteStream('access.log', {
    flags: 'a'
  });

  errorLog = fs.createWriteStream('error.log', {
    flags: 'a'
  });

  app = express();

  app.set('views', path.join(__dirname, 'views'));

  app.set('view engine', 'ejs');

  app.use(flash());

  app.use(favicon());

  app.use(logger('dev'));

  app.use(logger({
    stream: accessLog
  }));

  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded());

  app.use(cookieParser());

  app.use(session({
    secret: settings.cookieSecret,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30
    },
    store: new MongoStore({
      url: settings.url
    })
  }));

  app.use(express["static"](path.join(__dirname, 'public')));

  routes = require('./routes/index');

  routes(app);

  app.use(function(err, req, res, next) {
    var meta;
    meta = "[" + (new Date()) + "] - " + req.url + "\n";
    return errorLog.write("" + (meta + err.stack) + "\n");
  });

  app.use(function(req, res, next) {
    var err;
    err = new Error('找不到页面');
    err.status = 404;
    return next(err);
  });

  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      var status;
      status = err.status || 500;
      err.status = status;
      res.status(status);
      return res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  app.use(function(err, req, res, next) {
    var status;
    status = err.status || 500;
    err.status = status;
    res.status(status);
    return res.render('error', {
      message: err.message,
      error: {}
    });
  });

  app.set('port', process.env.PORT || 3000);

  server = app.listen(app.get('port'), function() {
    return console.log('Express 正在监听端口：' + server.address().port);
  });

  module.exports = app;

}).call(this);

//# sourceMappingURL=app.map
