var socket = new io.Socket("localhost"); 
socket.connect();
socket.on('connect', function () {
  // socket.send("dupa");
}); 
socket.on('message', function (msg) {
  console.log(msg);
}); 
var node_send = function(msg){
	socket.send(msg);
};
