var http    = require('http'),
    io      = require('socket.io'),
    fs      = require('fs');

var spawn = require('child_process').spawn;

//var filename = ''
var filename = process.argv[2];

// files starts at are argv[2]
var logfiles = process.argv.slice(2)

//var filename = 'log/smsc-gsm1.log'; 

//if (!filename) 
// {
//  console.log("Usage: node server.js filename_to_tail");
//  return;
//}


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


//io.on('connection', (socket) => {
//  socket.on('filename', (filename, fn) => {
//    console.log('got filename event with filename:' + filename);
//    console.log('filename before set: ' + filename);
//    filename = filename;
//    console.log('filename after set: '  + filename);
//    console.log('fn:' + fn)
//	  fn('this text sent to the client as ACK');
//  });
//});

io.on('connection', function(client){
  console.log('Client connected');

  for(let filename of logfiles) {
    console.log(filename)
    var tail = spawn("tail", ["-f", filename]);
    client.send( { filename : filename } );
    tail.stdout.on("data", function (data) {
      console.log(data.toString('utf-8'))
      client.send( { filename: filename, tail : data.toString('utf-8') } )
    }); 
  }
});





console.log('new Server running at http://0.0.0.0:8000/, connect with a browser to see tail output');
