var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 1234;
var msgStore = [];
var msgCount =0;
http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));
var clientArray = [];
// listen to 'chat' messages
io.on('connection', function(socket){
    //initialization of client
    clientArray.push(socket.id);
    console.log(socket.id);
    io.to(socket.id).emit('nick', 'User'+ io.engine.clientsCount);
    io.to(socket.id).emit('welcome',msgStore);
    console.log("msgStore " +msgStore);
   
    
    socket.on('chat', function( msg){
        msgCount++;
        var time = new Date();
        var msgObj = {time_id:time, body:msg,clientId:socket.id};
        io.emit('chat',msgObj );
        console.log("msgObj " +msgObj.time_id + " " + msgObj.body);
        msgStore.push(msgObj);
        if (msgCount>=200){
            msgStore.shift();
        }
       
    });

    socket.on('nick', function(nick){
        console.log(nick);
    
        io.to(socket.id).emit('nick', nick);
    //io.send('nick', nick);
    });

    
    console.log("There are "+io.engine.clientsCount+ " users");
});
