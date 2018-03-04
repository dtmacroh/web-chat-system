var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 1234;
var msgStore = [];
var msgCount =0;
var mapping = {};
var colors = {};
http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));
var clientArray = [];
// listen to 'chat' messages
io.on('connection', function(socket){
    //initialization of client
   
   
    //var msgStore2 =msgStore;

    // for(let i=0;i<msgStore.length;i++)
    // {
    //     msgStore2[i].clientId = mapping[msgStore[i].clientId];
        
    // }
    io.to(socket.id).emit('wel',msgStore);
   

    var possibleNick =  io.engine.clientsCount;
    var nick = "User"+possibleNick;
    // while (nick in Object.values(mapping))
    // {
    //     possibleNick++;
    //     nick = "User"+possibleNick;
       
    // }
    if (socket.id in mapping)
    {
        console.log("already exists");
    } else{
        mapping[socket.id] = nick;
        io.to(socket.id).emit('nick', nick);
    }
   
    let c = io.clients().sockets;
    let activeClients = [];
    for (n in c)
    {
       activeClients.push(mapping[n]);
    }
    io.emit('userList', activeClients);
       
    socket.on('chat', function( msg){
        msgCount++;
        var time = new Date();
        var chatUsr = mapping[socket.id];
        
        var msgObj = {time_id:time, body:msg,clientId:chatUsr,color:colors[socket.id]};
        io.emit('chat',msgObj );
        console.log("msgObj " +msgObj.time_id + " " + msgObj.body+ " "+msgObj.clientId);
        msgStore.push(msgObj);
        if (msgCount>=200){
            msgStore.shift();
        }
       
    });


    socket.on('nick', function(nick){
        if (nick in Object.values(mapping))
        {
            io.to(socket.id).emit('nick', -1);
        }
        else{
            console.log("nick is granted");
            mapping[socket.id] = nick;
            io.to(socket.id).emit('nick', nick);
        }
       
        io.emit('userList', Object.values(mapping))
    });
   
    socket.on('disconnect', function (socket) {
        let c = io.clients().sockets;
        let activeClients = [];
        for (n in c)
        {
           activeClients.push(mapping[n]);
        }
        io.emit('userList', activeClients);
      });
    
    socket.on('nickcolor', function (color) {
       colors[socket.id] = color;
      });

});
