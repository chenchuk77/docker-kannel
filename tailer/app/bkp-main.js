    var Application = function() {
    var socket = io('http://192.168.2.113:8000');
    //var socket = io('http://10.100.102.2:8000');
    var logfiles = [
      { filename: 'access.log',  color: 'black',  enabled: true },
      { filename: 'kannel.log',  color: 'gray',   enabled: true },
      { filename: 'smppbox.log', color: 'red',    enabled: true },
      { filename: 'smsc.log',    color: 'purple', enabled: true }
    ];

//../../volumes/972523245068/kannel/log/
//├── access.log
//├── kannel.log
//├── smppbox.log
//└── smsc.log




    $('#clear').click(function(event){
      console.log('clear button pressed.');
      $('#tail').html('');
    });

    // add a change-state button to each logfile
    for(let logfile of logfiles) {
      $('#buttons').append('<span class="butt hover">' + logfile.filename + '</span>');
    }

    // add click handler to change state
    $('#buttons').click(function(event){
      console.log('button pressed: ' + event.target.innerHTML);
      // flip state
      var logfile = logfiles.find(obj => obj.filename === event.target.innerHTML)
      if (logfile.enabled) {
        logfile.enabled = false;
        alert(logfile.filename + ' output disabled.');
      } else { 
        logfile.enabled = true;
        alert(logfile.filename + ' output enabled.');
      }
    });

    socket.on('connect', function() {
      console.log('Connected to:', socket.host);
    });

    socket.on('message', function(message) {
      console.log('Received message:', message);
      if (message.tail) {
	var logfile = logfiles.find(obj => obj.filename === message.filename)
        if (logfile.enabled) {
	  //$('#tail').append($('<span>').css('color', logfile.color).text(message.tail).append($('<br>')))
	  $('#tail').append($('<span>').css('color', logfile.color).text(message.tail));
          bottom = $("#tail")[0].scrollHeight - $("#tail").height()
          $('#tail').scrollTop(bottom);
	} else {
	  console.log('skipping disabled message from: ' + message.filename);
	}
        // write those messages also to message board

// example:
// 2020-03-05 13:02:43 Sent SMS [SMSC:gsm1] [SVC:testuser] [ACT:] [BINF:] [FID:] [META:?smpp?] [from:+972522736902] [to:+972544434545] [flags:-1:0:-1:0:0] [msg:30:rep from smpp-tester] [udh:0:]
//function parse_access_log(multiline) {

// get multiline tail output, convert to lines and add to table	
function add_board_entry(multiline) {
  lines = multiline.split(/\r?\n/);
  for(let line of lines) {
    if (line === "") continue;
    console.log('processing line: ' + line);
    var timestamp = line.split(' ').slice(0, 2).join(' ');
    var event = line.split(' ').slice(2, 4).join(' ');
    var data = line.split(' ');
    var event_args = data.splice(4);
    var smsc = get_arg_value(event_args, 'SMSC');
    var from = get_arg_value(event_args, 'from');
    var to   = get_arg_value(event_args, 'to');
    var msg  = get_arg_value(event_args, 'msg');


    var entry = '<tr><td>' + event + '</td> ' + 
                '<td>' + timestamp + '</td> ' +
                '<td>' + smsc + '</td>' + 
                '<td>' + from + '</td>' +
                '<td>' + to + '</td>' +
                '<td>' + msg + '</td></tr>'
    $("#messages").append($(entry));
  }
}


// example:
// "[SMSC:gsm1] [SVC:testuser] [ACT:] [BINF:] [FID:] [META:?smpp?] [from:+972522736902] [to:+972544434545] [flags:-1:0:-1:0:0] [msg:30:rep from smpp-tester] [udh:0:]"
function get_arg_value(args, key) {
  for(let arg of args) {
    var k = arg.replace(']','').replace('[','').split(':')[0];
    if (key === k){
      // special parsing for msg field
      if (key === 'msg') {
	var str = args.join(' ');
	var msg = str.substring(str.indexOf('msg'));
        msg = msg.substring(0, msg.indexOf(']'));
        return msg.split(':')[2];
      }
      return arg.replace(']','').replace('[','').split(':')[1]; 
    }
  }
  return "null";
}


        if (logfile.filename === 'log/access.log') {
          console.log('received access record');
          console.log(message.tail);
          // TODO: add this !!!
	  add_board_entry(message.tail);
	  
	  //$('#board').append(message.tail);
          //bottom = $("#board")[0].scrollHeight - $("#board").height()
          //$('#board').scrollTop(bottom);
	}
      }
    });
    return {
      socket : socket
    };
  };

$(document).ready(function() { var app = Application(); });
//$(function() { var app = Application(); });

