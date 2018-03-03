// shorthand for $(document).ready(...)
$(function() {
    var socket = io();
    var userNickSt=  $('#userNick').value;
    socket.emit('wel', "hidi");
    $('form').submit(function(){

    var message = $('#m').val();
        
    var mess_args = message.split(" ");
    if (mess_args.length==2 && mess_args[0]=="/nick")
    {
       
        socket.emit('nick', mess_args[1]);
        console.log(mess_args[1]);
    }
    else if (mess_args.length==2 && mess_args[0]=="/nickcolor") {
        console.log("nick color invoked");
    }
    else{
        socket.emit('chat',message );
    }
    
   

	$('#m').val('');
	return false;
    });
    socket.on('chat', function(msg){
    
        var time = new Date(msg.time_id);
        var body = msg.body;
    
        console.log(time + " "+ body);
        $('#messages').append($('<li>').text( time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' })+
        " "+msg.clientId+" " + msg.body));
     });

    socket.on('nick', function(nick){
        
       //insert check here
        
       $('#userNick').text(nick);
        userNickSt =  $('#userNick').text();
    
    });
    socket.on('wel', function(wel){
        for ( var i=0; i< wel.length;i++)
        {
            console.log("in client" +wel[i].time_id+ " "+wel[i].body+" "+wel[i].clientId)  ;
            $('#messages').append($('<li>').text( (new Date(wel[i].time_id)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' })
            +" " +wel[i].clientId+" " +wel[i].body));

        }
    });
        
        console.log(userNickSt);
    
    


});

//