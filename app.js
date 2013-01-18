var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    nib = require('nib'),
    stylus = require('stylus'),
    path = require('path');

var app = express();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/public');
  app.set('view engine', 'jade');
  app.locals.pretty = true;
  app.use(express.logger('dev'));
  // app.use(express.favicon());
  app.use(express.compress());
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(stylus.middleware({
    src: __dirname + '/public',
    dest: __dirname + '/public',
    force: true,
    compile: compile
  }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));

});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

var server = http.createServer(app);

server.on('error', function(err) {
  console.error(err.stack);
  console.error("Ensure this port is free");
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
