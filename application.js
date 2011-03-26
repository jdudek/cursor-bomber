exports.App = function () {
  var self = this
  var players = []

  self.bind = function (name, fn) {
    self.boundEvents = self.boundEvents || {}
    self.boundEvents[name] = self.boundEvents[name] || []
    self.boundEvents[name].push(fn)
  }
  self.trigger = function (name) {
    if (self.boundEvents[name]) {
      self.boundEvents[name].forEach(function (fn) { fn() })
    }
  }
  self.addPlayer = function (socketClient) {
    var index = players.length
    players[index] = new Player(self, index, socketClient)
    return players[index]
  }
  self.destroyPlayer = function (index) {
    players.splice(index, 1)
    console.log("player: " + index + " destroyed")
  }
  self.getPlayersPositions = function () {
    var ret = []
    for (i in players) {
      ret.push(players[i].getPosition())
    }
    return ret
  }
};

var Player = function (app, index, socketClient) {
  var self = this
  var cursorPosition = { x: 0, y: 0 }

  self.updatePosition = function (newPosition) {
    cursorPosition.x = newPosition.x
    cursorPosition.y = newPosition.y
    console.log("player: " + index + " ", cursorPosition)
    app.trigger("playerMove")
  }
  self.destroy = function () {
    app.destroyPlayer(index)
  }
  self.getPosition = function () {
    return cursorPosition
  }
}
