var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/',function(req, res){
  res.sendFile(__dirname + '/client.html');
});

var count=1;
io.on('connection', function(socket){
  console.log('user connected: ', socket.id);
  var name = "user" + count++;
  io.to(socket.id).emit('change name',name);
  //io.emit('receive message', "<b>" + name + "님</b>이 접속하셨습니다.");
  io.emit('receive message', '<div class="c_center"><div class="c_notice c_n2">(&nbsp;<span class="bold">' + name + '님</span>이 입장하셨습니다&nbsp;)</div></div>');

  socket.on('disconnect', function(){
    console.log('user disconnected: ', socket.id);
    io.emit('receive message', '<div class="c_center"><div class="c_notice c_n1">(&nbsp;<span class="bold">' + name + '님</span>이 퇴장하셨습니다&nbsp;)</div></div>');
  });

  socket.on('send message', function(name,text){
    var msg = name + ' : ' + text;
    console.log(msg);
    msg = msg.replace("<", "&lt;");
    msg = msg.replace(">", "&gt;");
    io.emit('receive message', msg);
  });
});

http.listen(3000, function(){
  console.log('Server Start!');
});
