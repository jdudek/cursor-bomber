var socket = new io.Socket("localhost"); 
socket.connect();
socket.on('connect', function () {
  socket.send({ cursorPosition: { x: 100, y: 120 }})
}) 
socket.on('message', function (msg) {
  alert(msg)
}) 
