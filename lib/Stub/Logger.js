var Factory = require('./Factory').Factory

var settings = {
  defaults: {
    allure: {
      filename: 'voxengine.log',
      mimeType: 'text/plain'
    }
  },
  state: {messages: []},
  handlers: {
    write: function (self, message) {
      self._state.messages.push({timestamp: new Date(), message: message})
    }
  },
  onFlush: function (self) {
    var allure = self._settings.allure
    if (!allure.enabled || !global.allure) {
      return
    }
    var lines = self._state.messages.map(function (entry) {
      return entry.timestamp.toISOString() + ': ' + entry.message
    })
    var content = lines.join('\r\n')
    global.allure.createAttachment(allure.filename, content, allure.mimeType)
  }
}

module.exports = {
  Logger: Factory.create('Logger', settings)
}
