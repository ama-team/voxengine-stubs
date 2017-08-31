var Stubs = require('./Stub')
var Objects = require('./Utility').Objects

/**
 * Library entrypoint, installs and withdraws global symbols
 *
 * @param {object} [context] Global value to populate
 *
 * @class
 *
 * @implements IStubManager
 */
function Manager (context) {
  var self = this
  context = context || global
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
      if (context.hasOwnProperty(symbol)) {
        self._stash[symbol] = context[symbol]
      }
    })
  }

  function unstash () {
    if (!self._stash) {
      return
    }
    eachSymbol(function (symbol) {
      if (self._stash.hasOwnProperty(symbol)) {
        context[symbol] = self._stash[symbol]
      } else {
        delete context[symbol]
      }
    })
    delete self._stash
  }

  this.setup = function (settings) {
    self._settings = settings
    eachSymbol(function (symbol, _, configuration) {
      if (!context[symbol] || !context[symbol]._setup) {
        return
      }
      context[symbol]._setup(configuration)
    })
  }

  this.install = function () {
    stash()
    eachSymbol(function (symbol, Stub, configuration) {
      var stub = typeof Stub === 'function' ? new Stub(configuration) : Stub
      stub._setup && stub._setup(configuration)
      context[symbol] = stub
    })
  }

  this.reset = function () {
    eachSymbol(function (symbol) {
      context[symbol] && context[symbol]._reset && context[symbol]._reset()
    })
  }

  this.flush = function () {
    eachSymbol(function (symbol) {
      context[symbol] && context[symbol]._flush && context[symbol]._flush()
    })
  }

  this.uninstall = function () {
    self.flush()
    unstash()
  }
}

module.exports = {
  Manager: Manager
}
