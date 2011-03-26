exports.App = function () {
  var self = this
  var players = []
  var bombs = []

  self.bind = function (names, fn) {
    if (!Array.isArray(names)) {
      names = [names]
    }
    self.boundEvents = self.boundEvents || {}
    names.forEach(function (name) {
      self.boundEvents[name] = self.boundEvents[name] || []
      self.boundEvents[name].push(fn)
    })
  }
  self.trigger = function (name) {
    if (self.boundEvents[name]) {
      self.boundEvents[name].forEach(function (fn) { fn() })
    }
    console.log(name)
  }
  self.addPlayer = function (socketClient) {
    var index = players.length
    players[index] = new Player(self, index, socketClient)
    return players[index]
  }
  self.destroyPlayer = function (index) {
    players.splice(index, 1)
  }
  self.getPlayersPositions = function () {
    var ret = []
    for (i in players) {
      ret.push(players[i].getPosition())
    }
    return ret
  }
  self.getBombs = function () {
    return bombs.map(function (bomb) {
      return { x: bomb.x, y: bomb.y, size: bomb.size }
    })
  }
  self.setBomb = function (position) {
    var index = bombs.length
    bombs[index] = new Bomb(self, index, position)
    return bombs[index]
  }
  self.destroyBomb = function (bomb) {
    var index = bombs.indexOf(bomb)
    bombs.splice(index, 1)
  }
};

var Player = function (app, index, socketClient) {
  var self = this
  var cursorPosition = { x: 0, y: 0 }

  self.updatePosition = function (newPosition) {
    cursorPosition.x = newPosition.x
    cursorPosition.y = newPosition.y
    console.log("player: " + index + " ", cursorPosition)
    app.trigger("playerMoved")
  }
  self.destroy = function () {
    app.destroyPlayer(index)
  }
  self.getPosition = function () {
    return cursorPosition
  }
}

var Bomb = function (app, index, position) {
  var self = this

  self.x = position.x
  self.y = position.y
  self.size = 0

  app.trigger("bombCreated")

  setTimeout(function update () {
    self.size += Bomb.SIZE_STEP
    app.trigger("bombUpdated")

    if (self.size > Bomb.MAX_SIZE) {
      self.destroy()
    } else {
      setTimeout(update, Bomb.STEP_TIMEOUT)
    }
  }, Bomb.STEP_TIMEOUT)

  self.destroy = function () {
    app.destroyBomb(self)
    app.trigger("bombDestroyed")
  }
}
Bomb.SIZE_STEP = 1
Bomb.STEP_TIMEOUT = 100
Bomb.MAX_SIZE = 100
