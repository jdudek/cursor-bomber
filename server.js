require.paths.unshift('.');
var http = require('http'),
    io = require('socket.io'),
    static = require('node-static'),
    application = require('application');

var app = new application.App()

var fileServer = new static.Server('./public');

var server = http.createServer(function (req, res) {
  req.addListener('end', function () {
    fileServer.serve(req, res);
  });
});
server.listen(3000);

var socket = io.listen(server);
socket.on('connection', function (socketClient) {
  var player = app.addPlayer(socketClient)
  socketClient.on('message', function (msg) {
    if (typeof msg.cursorPosition != "undefined") {
      player.updatePosition(msg.cursorPosition)
    }
  })
  socketClient.on("disconnect", function () {
    player.destroy()
  })
});

app.bind("playerMove", function () {
  socket.broadcast({ positions: app.getPlayersPositions() })
})
