var http = require('http'),
    io = require('socket.io'),
    static = require('node-static');

var fileServer = new static.Server('./public');

var server = http.createServer(function (req, res) {
  req.addListener('end', function () {
    fileServer.serve(req, res);
  });
});
server.listen(3000);

var socket = io.listen(server);
socket.on('connection', function (client) { 
  client.on('message', function (msg) { console.log(msg) }) 
});
