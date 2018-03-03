var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 1234;
var msgStore = [];
var msgCount =0;
var mapping = {};
http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));
var clientArray = [];
// listen to 'chat' messages
io.on('connection', function(socket){
    //initialization of client
    clientArray.push(socket.id);
      
    //var msgStore2 =msgStore;

    // for(let i=0;i<msgStore.length;i++)
    // {
    //     msgStore2[i].clientId = mapping[msgStore[i].clientId];
        
    // }
    io.to(socket.id).emit('wel',msgStore);
   

    io.to(socket.id).emit('nick', 'User'+ io.engine.clientsCount);
    mapping[socket.id] = 'User'+ io.engine.clientsCount;
    console.log("msgStore " +msgStore);
  
    
    socket.on('chat', function( msg){
        msgCount++;
        var time = new Date();
        var chatUsr = mapping[socket.id];
        
        var msgObj = {time_id:time, body:msg,clientId:chatUsr};
        io.emit('chat',msgObj );
        console.log("msgObj " +msgObj.time_id + " " + msgObj.body+ " "+msgObj.clientId);
        msgStore.push(msgObj);
        if (msgCount>=200){
            msgStore.shift();
        }
       
    });





    socket.on('nick', function(nick){
        console.log(nick);
        if (nick in Object.values(mapping))
        {
            console.log("nick in use");
        }
        else{
            console.log("nick is granted");
            mapping[socket.id] = nick;
        }
        io.to(socket.id).emit('nick', nick);
    //io.send('nick', nick);
    });
   

    
    console.log("There are "+io.engine.clientsCount+ " users");
});
