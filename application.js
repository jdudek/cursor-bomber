exports.App = function () {
  var self = this
  var players = []
  var bombs = []
	var colorSequence = new ColorSequence()

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
    players[index] = new Player(self, index, socketClient, colorSequence.getNextColor())
    return players[index]
  }
  self.destroyPlayer = function (index) {
    players.splice(index, 1)
  }
  self.getPlayersPositions = function () {
    var ret = []
    for (i in players) {
      ret.push(players[i].serialize())
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

var Player = function (app, index, socketClient, color) {
  var self = this
  var position = { x: 0, y: 0 }

  self.updatePosition = function (newPosition) {
    position.x = newPosition.x
    position.y = newPosition.y
    console.log("player: " + index + " ", position)
    app.trigger("playerMoved")
  }
  self.destroy = function () {
    app.destroyPlayer(index)
  }
  self.serialize = function () {
    return {x: position.x, y: position.y, color: color}
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
Bomb.MAX_SIZE = 30

var ColorSequence = function() {
	var lastColor = 10
 	this.getNextColor = function () {
		lastColor += 96
		if(lastColor>255){
			lastColor -= 248
		}
		return "hsl("+lastColor+", 100%, 50%)"
	}	
}
