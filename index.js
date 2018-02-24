var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 1230;

http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));

// listen to 'chat' messages
io.on('connection', function(socket){
    
    io.emit('nick', 'User'+ io.engine.clientsCount);

    socket.on('chat', function( msg){
    var time = new Date();
	io.emit('chat', {time_id:time, body:msg});
    });


    socket.on('nick', function(nick){
    console.log(nick);
    io.send('nick', nick);
    });
    
    console.log("There are "+io.engine.clientsCount+ " users");
});
