var Stubs = require('./Stub')
var Objects = require('./Utility').Objects

/**
 * Library entrypoint, installs and withdraws global symbols
 *
 * @class
 *
 * @implements IStubManager
 */
function Manager () {
  var self = this
  self._settings = {}
  self._stash = null

  function eachSymbol (callback) {
    Object.keys(Stubs).forEach(function (symbol) {
      var configuration = self._settings.global || {}
      configuration = Objects.merge(configuration, self._settings[symbol] || {})
      callback(symbol, Stubs[symbol], configuration)
    })
  }

  function stash () {
    if (self._stash) {
      return
    }
    self._stash = {}
    eachSymbol(function (symbol) {
      if (global.hasOwnProperty(symbol)) {
        stash[symbol] = global[symbol]
      }
    })
  }

  function unstash () {
    if (!self._stash) {
      return
    }
    eachSymbol(function (symbol) {
      if (self._stash.hasOwnProperty(symbol)) {
        global[symbol] = self._stash[symbol]
      } else {
        delete global[symbol]
      }
    })
    delete self._stash
  }

  this.setup = function (settings) {
    self._settings = settings
  }

  this.install = function () {
    stash()
    eachSymbol(function (symbol, Mock, configuration) {
      var mock = new Mock(configuration)
      mock._setup && mock._setup(configuration)
      global[symbol] = mock
    })
  }

  this.reset = function () {
    eachSymbol(function (symbol) {
      global[symbol] && global[symbol]._reset && global[symbol]._reset()
    })
  }

  this.flush = function () {
    eachSymbol(function (symbol) {
      global[symbol] && global[symbol]._flush && global[symbol]._flush()
    })
    self.reset()
  }

  this.uninstall = function () {
    self.flush()
    unstash()
  }
}

module.exports = {
  Manager: Manager
}
