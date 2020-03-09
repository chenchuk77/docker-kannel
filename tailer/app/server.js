var http = require('http');
var fs   = require('fs');
var io   = require('socket.io');
var path = require('path');

var spawn = require('child_process').spawn;

// TODO: get dynamic list from client upon connection
var logfiles = ['log/kannel.log', 'log/access.log', 'log/smsc-gsm0.log', 'log/smsc-gsm1.log', 'log/opensmppbox1.log' ]




// -- Node.js Server -- //
server = http.createServer(function(req, res){
  res.writeHead(200, {'Content-Type': 'text/html'})
  var filePath = req.url;
  if (filePath == '/') filePath = '/index.html';
  filePath = __dirname+filePath;
  var extname = path.extname(filePath);
  var contentType = 'text/html';
  switch (extname) {
    case '.js':
        contentType = 'text/javascript';
        break;
    case '.css':
        contentType = 'text/css';
        break;
  }
  fs.exists(filePath, function(exists) {
    if (exists) {
      fs.readFile(filePath, function(error, content) {
        if (error) {
          res.writeHead(500);
          res.end();
	  console.warn('served file: '+ filePath + ', content-type: ' + contentType);
        } else {
          res.writeHead(200, { 'Content-Type': contentType  });
          res.end(content, 'utf-8');
	  console.log('served file: '+ filePath + ', content-type: ' + contentType);
        }
      });
    }
  })
})
server.listen(8000, '0.0.0.0');

// -- Setup Socket.IO -- //
var io = io.listen(server);

io.on('connection', function(client){
  console.log('Client connected');
  for(let logfile of logfiles) {
    console.log(logfile)
    var tail = spawn("tail", ["-f", logfile]);
    client.send( { filename : logfile } );
    tail.stdout.on("data", function (data) {
      console.log(data.toString('utf-8'))
      client.send( { filename: logfile, tail : data.toString('utf-8') } )
    });
  }
});

console.log('new Server running at http://0.0.0.0:8000/, connect with a browser to see tail output');

