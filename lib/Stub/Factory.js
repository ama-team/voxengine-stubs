var Sinon = require('sinon')

var Objects = require('../Utility/index').Objects
var Defaults = require('./GlobalDefaults')

/**
 * @namespace
 */
var StubFactory = {
  /**
   * @param {string} symbol
   * @param {TMockSettings} settings
   * @return {IStub}
   */
  create: function (symbol, settings) {
    var mock = function (configuration) {
      var self = this
      this.name = symbol

      this._setup = function (configuration) {
        var buffer = Objects.merge(Defaults, settings.defaults)
        buffer = Objects.merge(buffer, configuration || {})
        self._settings = buffer
        self._reset()
      }

      this._reset = function () {
        self.hasOwnProperty('_state') && self._flush()
        self._state = Objects.copy(settings.state || {})
        var properties = settings.properties || {}
        Object.keys(properties).forEach(function (name) {
          self[name] = properties[name]
        })
        var handlers = settings.handlers || {}
        Object.keys(handlers).forEach(function (name) {
          self[name] = Sinon.spy(function () {
            var args = Array.prototype.slice.call(arguments)
            args.unshift(self)
            return handlers[name].apply(this, args)
          })
        })
      }

      this._flush = function () {
        if (typeof settings.onFlush === 'function') {
          settings.onFlush(self)
        }
      }

      this._setup(configuration)
    }
    Object.defineProperty(mock, 'name', {value: symbol, writable: false})
    return mock
  }
}

module.exports = {
  Factory: StubFactory
}
