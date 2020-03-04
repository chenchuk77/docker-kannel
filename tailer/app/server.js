var http    = require('http'),
    io      = require('socket.io'),
    fs      = require('fs');

var spawn = require('child_process').spawn;

var filename = process.argv[2];
if (!filename) 
{
  console.log("Usage: node server.js filename_to_tail");
  return;
}


// -- Node.js Server ----------------------------------------------------------

server = http.createServer(function(req, res){
  res.writeHead(200, {'Content-Type': 'text/html'})
  console.log('__dirname = ' + __dirname);
  fs.readFile(__dirname + '/index.html', function(err, data){
    res.write(data, 'utf8');
    res.end();
  });
})
server.listen(8000, '0.0.0.0');

// -- Setup Socket.IO ---------------------------------------------------------


//var io = io.listen(server);
var io = io.listen(server);

io.on('connection', function(client){
  console.log('Client connected');
  var tail = spawn("tail", ["-f", filename]);
  client.send( { filename : filename } );

  tail.stdout.on("data", function (data) {
    console.log(data.toString('utf-8'))
    client.send( { tail : data.toString('utf-8') } )
  }); 

});

console.log('new Server running at http://0.0.0.0:8000/, connect with a browser to see tail output');
