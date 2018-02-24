// shorthand for $(document).ready(...)
$(function() {
    var socket = io();
    var userNickSt= "";
    $('form').submit(function(){
    var message = $('#m').val();
        
    var mess_args = message.split(" ");
    if (mess_args.length==2 && mess_args[0]=="/nick")
    {
        console.log("changing Nick");
        socket.emit('nick', mess_args[1]);
        console.log(mess_args[1]);
    }
    else{
        console.log("still of the chat");
        socket.emit('chat',message );
    }
	
	$('#m').val('');
	return false;
    });
    socket.on('chat', function(msg){
    
    //console.log(user);
    var time = new Date(msg.time_id);
    var body = msg.body;
    console.log(time + " "+ body);
	$('#messages').append($('<li>').text( time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' })+" "+userNickSt+" " + msg.body));
    });

    socket.on('nick', function(nick){
        
       //console.log(nick);
        $('#userNick').text(nick);
        userNickSt =  $('#userNick').text();
    
    });
        
        console.log(userNickSt);
    
    


});

//