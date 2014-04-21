"use strict";
 
// web.js

var express = require('express');
var http = require('http');
var path = require('path');
var WebSocketServer = require('ws').Server;

var app = express();

var app = connect();
app.use(logger);
app.use(allowCrossDomain);
app.use(responder);
var server = http.createServer(app);

function responder(request, response, next) {
  var pathname = url.parse(request.url).pathname;
  // var route = pathname.match(/^\/task_?lists?\/([a-zA-Z0-9]*)$/);
  
    if ('GET' == request.method) {
        response.write("blubb");
        response.end();
  	}

}

function logger(request, response, next) {
  console.log('%s %s', request.method, request.url);
  next();
}

function allowCrossDomain(request, response, next) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});