var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 1234;

http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));
var clientArray = [];
// listen to 'chat' messages
io.on('connection', function(socket){
    clientArray.push(socket.id);
    console.log(socket.id);

   // io.engine.clients[socket.id].emit('nick', 'User'+ io.engine.clientsCount);
    io.to(socket.id).emit('nick', 'User'+ io.engine.clientsCount);
    socket.on('chat', function( msg){
    var time = new Date();
	io.emit('chat', {time_id:time, body:msg});
    });

    
    
    socket.on('nick', function(nick){
        console.log(nick);
    
        io.to(socket.id).emit('nick', nick);
    //io.send('nick', nick);
    });
    
    console.log("There are "+io.engine.clientsCount+ " users");
});
