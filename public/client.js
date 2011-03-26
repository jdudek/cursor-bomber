var socket = new io.Socket("192.168.0.42"); 
socket.connect();
socket.on('connect', function () {
  // socket.send("dupa");
}); 
socket.on('message', function (msg) {
	if(msg.positions) {
		players = msg.positions;
	}
	if(msg.bombs) {
		bombs = msg.bombs;
	}
}  
); 
var node_send = function(msg){
	socket.send(msg);
};
