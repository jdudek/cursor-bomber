var socket = new io.Socket("localhost"); 
socket.connect();
socket.on('connect', function () {
  socket.send("dupa")
}) 
socket.on('message', function (msg) {
  alert(msg)
}) 
