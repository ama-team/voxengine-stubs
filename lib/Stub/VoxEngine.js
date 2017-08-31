var Yaml = require('js-yaml')

var Objects = require('../Utility').Objects
var Factory = require('./Factory').Factory

var definition = {
  defaults: {
    allure: {
      events: {
        filename: 'voxengine.events.yml',
        mimeType: 'application/x-yaml'
      },
      listeners: {
        filename: 'voxengine.event-listeners.yml',
        mimeType: 'application/x-yaml'
      },
      customData: {
        filename: 'voxengine.custom-data.yml',
        mimeType: 'application/x-yaml'
      }
    },
    customData: {
      default: ''
    },
    terminate: {
      throwOnMultipleCalls: false,
      throwOnLostContext: true
    }
  },
  state: {
    terminate: {
      calls: 0
    },
    listeners: {},
    log: {
      listeners: [],
      events: [],
      customData: []
    }
  },
  handlers: {
    terminate: function (self) {
      var count = ++self._state.terminate.calls
      var message
      if (self._settings.terminate.throwOnMultipleCalls && count > 1) {
        message = 'VoxEngine.terminate has been called ' + count + ' times, ' +
          'which is forbidden by settings'
        throw new Error(message)
      }
      if (self !== this && self._settings.terminate.throwOnLostContext) {
        message = 'It seems like `VoxEngine.terminate` has been called ' +
          'unbounded and lost it\'s `this`. Please ensure that you are not ' +
          'passing `VoxEngine.terminate` as callback ' +
          '(`VoxEngine.terminate.bind(VoxEngine)` should do the trick) ' +
          'and not storing it in and then calling from a variable.'
        throw new Error(message)
      }
    },
    customData: function (self, data) {
      if (arguments.length > 1) {
        self._state.log.customData.push(data)
        self._state.customData = data
        return data
      }
      if (self._state.hasOwnProperty('customData')) {
        return self._state.customData
      }
      return self._settings.customData.default
    },
    addEventListener: function (self, event, handler) {
      var listeners = self._state.listeners
      if (!listeners[event.name]) {
        listeners[event.name] = []
      }
      var entry = {event: event.name, action: 'add', handler: handler}
      self._state.log.listeners.push(entry)
      listeners[event.name].push(handler)
    },
    removeEventListener: function (self, event, handler) {
      var listeners = self._state.listeners
      if (arguments.length === 2) {
        self._state.log.listeners.push({event: event.name, action: 'purge'})
        delete listeners[event.name]
        return
      }
      var entry = {event: event.name, action: 'remove', handler: handler}
      self._state.log.listeners.push(entry)
      var handlers = listeners[event.name] || []
      var index = handlers.indexOf(handler)
      if (index === -1) {
        return null
      }
      var value = handlers.splice(index, 1)[0]
      if (handlers.length === 0) {
        delete listeners[event.name]
      }
      return value
    },
    _emit: function (self, event) {
      var listeners = self._state.listeners[event.name] || []
      listeners.forEach(function (listener) {
        listener(event)
      })
      self._state.log.events.push(event)
    }
  },
  onFlush: function (self) {
    var allure = self._settings.allure
    if (!allure.enabled || !global.allure) {
      return
    }
    function attach (type, content) {
      var filename = allure[type].filename
      var mimeType = allure[type].mimeType
      global.allure.createAttachment(filename, Yaml.dump(content), mimeType)
    }
    var customData = self._state.log.customData
    if (customData.length > 0) {
      attach('customData', customData)
    }
    var events = self._state.log.events
    if (events.length > 0) {
      attach('events', events)
    }
    var listeners = self._state.log.listeners
    if (listeners.length > 0) {
      listeners = listeners.map(function (entry) {
        entry = Objects.copy(entry)
        if (entry.handler) {
          entry.handler = entry.handler.name || entry.handler.toString()
        }
      })
      attach('listeners', listeners)
    }
  }
}

module.exports = {
  VoxEngine: Factory.create('VoxEngine', definition)
}
