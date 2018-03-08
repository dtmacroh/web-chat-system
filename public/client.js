/*

Name:       Debbie Macrohon
UCID:       10121170
Description:Client side code for chat application

*/

// shorthand for $(document).ready(...)

//alert(document.cookie);
document.cookie = "";
$(function() {

    
    var socket = io();
    var userNickSt=  $('#userNick').value;
    var color= "";
   

    if (document.cookie=="name=" || document.cookie=="" ){
        socket.emit('init');
    }
    else{
        socket.emit('rec', document.cookie);
        
    }
   


    $('form').submit(function(){

    var message = $('#m').val();
        
    var mess_args = message.split(" ");
    if (mess_args.length==2 && mess_args[0]=="/nick")
    {
        socket.emit('nick', mess_args[1]);
    }
    else if (mess_args.length==2 && mess_args[0]=="/nickcolor") {
        console.log("nick color invoked");
        socket.emit('nickcolor', mess_args[1]);
        color = mess_args[1];
        console.log(color);
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
       // $('#messages').append($('<li>').text( time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' })+
       // " "+msg.clientId+" " + msg.body));
      
        $('#messages').append($('<li>').html( time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' })+
        '<p style = "display:inline; color:#'+msg.color+'"> &nbsp'+
         msg.clientId+'&nbsp</p>'+ msg.body));
      
       if (userNickSt==msg.clientId){
         $( "#messages" ).children().last().css( "font-weight", "bold" );
        // $( "#messages" ).children().last().children().last().css( "color", "#"+color );
       }

     });

    socket.on('nick', function(nick){
        
       //insert check here
        if (nick!=-1){
            $('#userNick').text(nick);
            userNickSt =  $('#userNick').text();
            if (userNickSt !=""){
            document.cookie = "name="+ userNickSt;}
            alert(document.cookie);
        }
      
    
    });
    socket.on('wel', function(wel){
        for ( var i=0; i< wel.length;i++)
        {
            if (userNickSt===wel[i].clientId){
                $('#messages').append($('<li>').html(  '<b>' +(new Date(wel[i].time_id)).toLocaleString('en-US', { hour: 'numeric', 
                minute: 'numeric' }) +'<b> &nbsp' +wel[i].clientId+'&nbsp</b>' +wel[i].body)+ '</b>' );
            }
            else{
                $('#messages').append($('<li>').html( (new Date(wel[i].time_id)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' })
                +" " +wel[i].clientId+" " +wel[i].body));
            }

        }
    });
    socket.on('userList', function(list){
        $('#userList').empty();
        for ( var i=0; i< list.length;i++)
        {
            // console.log(list[i]);
             $('#userList').append($('<li>').text(list[i]));
        }
         
    });
       
   


});

//