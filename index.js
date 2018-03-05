var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var cookieParser = require('cookie-parser');
var port = process.env.PORT || 1234;
var msgStore = [];
var msgCount =0;
var mapping = {};
var colors = {};
var clientCount = 0;
http.listen( port, function () {
    console.log('listening on port', port);
});

// app.use (cookieParser ());
// app.get ('/', function(req, res) {
//     // check existing cookies
//     console.log("Cookies :  ", req.cookies);
//     // set a new cookie that will last 1 hr
//     res.cookie ("user", "bob", { maxAge: 60 * 60 * 1000 });
//     // clear a cookie (logout)
//     res.clearCookie("user");
//   });
app.use(express.static(__dirname + '/public'));

  

// listen to 'chat' messages
io.on('connection', function(socket){
    //initialization of client
    io.to(socket.id).emit('wel',msgStore);
   console.log(socket.id);
    var nick = "User"+clientCount++;
    if (socket.id in mapping)
    {
        console.log("already exists");
    } else{
        mapping[socket.id] = nick;
        io.to(socket.id).emit('nick', nick);
    }
    reSendActiveList(io);
       
    socket.on('chat', function( msg){
        msgCount++;
        var time = new Date();
        var chatUsr = mapping[socket.id];
        
        var msgObj = {time_id:time, body:msg,clientId:chatUsr,color:colors[socket.id]};
        io.emit('chat',msgObj );
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
            reSendActiveList(io);
        }
       
      
    });
   
    socket.on('disconnect', function (socket) {
        reSendActiveList(io);
      });
    socket.on('reconnect', function (sameNick) {
        console.log('reconnecting');
        for (var n in mapping)
       {
           if (mapping[n] = sameNick)
           {
               console.log(n);
               delete mapping[n];
               mapping[socket.id] = sameNick;

           }
       }
      
      });
    socket.on('nickcolor', function (color) {
       colors[socket.id] = color;
      });

      function reSendActiveList(io){
        let c = io.clients().sockets;
        let activeClients = [];
        for (n in c)
        {
        activeClients.push(mapping[n]);
        }
        io.emit('userList', activeClients);

      }
});
