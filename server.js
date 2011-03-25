// require.paths.unshift('.');
var http = require('http'),
    io = require('socket.io'),
    static = require('node-static');

// var app = new application.App()

var fileServer = new static.Server('./public');

var server = http.createServer(function (req, res) {
  req.addListener('end', function () {
    fileServer.serve(req, res);
  });
});
server.listen(3000);

var app = {
  init: function () {
    this.count = 0
    this.players = []
  },
  addPlayer: function (socketClient) {
    var i = this.count++
    var newPlayer = { socketClient: socketClient, cursorPosition: { x: 0, y: 0 }}
    this.players[i] = newPlayer
    newPlayer.updatePosition = function (newPosition) {
      this.cursorPosition.x = newPosition.x
      this.cursorPosition.y = newPosition.y
      console.log("player: " + i + " ", this.cursorPosition)
    }
    newPlayer.destroy = function () {
      app.players.splice(i, 1)
      console.log("player: " + i + " destroyed")
    }
    return newPlayer
  }
};

app.init();

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
