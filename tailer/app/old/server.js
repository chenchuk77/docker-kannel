var http    = require('http'),
    io      = require('socket.io'),
    fs      = require('fs');

var spawn = require('child_process').spawn;

//var filename = process.argv[2];

// // files starts at are argv[2]
// var logfiles = process.argv.slice(2)

var logfiles = ['log/kannel.log', 'log/access.log', 'log/smsc-gsm0.log', 'log/smsc-gsm1.log', 'log/opensmppbox1.log' ]

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
