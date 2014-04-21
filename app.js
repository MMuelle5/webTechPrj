
var express = require('express'),
 http = require('http'),
 url   = require('url'),
 fs = require('fs'),
 path = require('path');

var app = express();

// all environments
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(responder);
app.use(express.logger());
var server = http.createServer(app);


function responder(request, response, next) {

  var pathname = url.parse(request.url).pathname;
  var route = pathname.match(/^\/tasks\/([a-zA-Z0-9]*)$/);
  
  var id = '';
  if (route) {
    id = route[1]
  }
  if (id == '' && 'GET' == request.method) {
    show(request, response);
  }
  else if (id != '' && 'PUT' == request.method) {
  	request.setEncoding('utf8');
  	storeTask(request.body);
	response.writeHead(200, 'application/json');
	response.end();
  }
  else if (id == '' && 'POST' == request.method) {
	response.writeHead(200, 'application/json');
    response.write(JSON.stringify(storeNewTask(request.body)));
	response.end();
  }
  else if (id != '' && 'DELETE' == request.method) {
	deleteTask(id);
	response.writeHead(200, 'application/json');
	response.end();
  }
}
function storeNewTask(rec) {
	
	var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
	var uniquId = randLetter + Date.now();
	rec.id = uniquId;
	var file = path.join(process.cwd(), '/db', 'tasks');
	fs.readFile(file, 'utf8', function(err, data) {
		var tasks= JSON.parse(data);
	  	tasks.push(rec);
		store(tasks, function() {});
	});
  return rec;
}
function storeTask(rec) {
  var file = path.join(process.cwd(), '/db', 'tasks');
  
  fs.readFile(file, 'utf8', function(err, data) {
  	var tasks = JSON.parse(data);
  	for(var i = 0; i < tasks.length; i++) {
  		if(tasks[i].id == rec.id) {
  			tasks[i] = rec;
  			store(tasks, function() {});
  			break;
  		}
  	}
  });
}
function deleteTask(id) {
	var file = path.join(process.cwd(), '/db', 'tasks');
	fs.readFile(file, 'utf8', function(err, data) {
		var tasks= JSON.parse(data);
		var idx = -1;
	  	for(var i = 0; i < tasks.length; i++) {
	  		if(tasks[i].id == id) {
				idx = i;
				break;
			}
		}
		if(idx != -1) {
			tasks.splice(idx, 1);
			store(tasks, function() {});
		}
	});
}

function store(tasks, callback) {
  tasks.id = 'tasks';
  var file = path.join(process.cwd(), '/db', 'tasks');
  fs.writeFile(file, JSON.stringify(tasks), 'utf8', function(err) {
    if (err) throw err;
    console.log("stored");
    callback();
  });
}

function show(request, response) {
  var file = path.join(process.cwd(), '/db', 'tasks');
  fs.exists(file, function(exists) {
    if (exists) {
      fs.readFile(file, 'utf8', function(err, data) {
        if (err) throw err;
        response.writeHead(200, 'application/json');
        response.write(data);
        response.end();
      });
    } else {
      send404(response, id);
    }
  });
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

server.listen(5000, function() {
  console.log("Listening on 5000");
});