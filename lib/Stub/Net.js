var Factory = require('./Factory').Factory

var HttpRequestOptions = function () {
  this.headers = []
  this.method = 'GET'
  this.params = {}
  this.postData = ''
  this.rawOutput = false
  this.timeout = 90
}

Object.defineProperty(HttpRequestOptions, 'name', {
  value: 'Net.HttpRequestOptions',
  writable: false
})

var HttpRequestResult = function () {
  this.code = 200
  this.data = undefined
  this.error = ''
  this.headers = []
  this.raw_headers = ''
  this.text = ''
}

Object.defineProperty(HttpRequestResult, 'name', {
  value: 'Net.HttpRequestResult',
  writable: false
})

var definition = {
  defaults: {
    http: {
      responses: [],
      roundRobin: false
    }
  },
  state: {
    http: {},
    log: {
      http: []
    }
  },
  properties: {
    HttpRequestOptions: HttpRequestOptions,
    HttpRequestResult: HttpRequestResult
  },
  handlers: {
    httpRequest: function (self, url, callback, options) {
      if (!self._state.http.responses) {
        self._state.http.responses = self._settings.http.responses.slice()
      }
      var responses = self._state.http.responses
      var index = -1
      for (var i = 0; i < responses.length; i++) {
        var cursor = responses[i]
        if (!cursor.matcher || cursor.matcher(url, options)) {
          index = i
          break
        }
      }
      if (index === -1) {
        var message = 'Failed to find matching response for url ' + url +
          ' and options ' + JSON.stringify(options)
        throw new Error(message)
      }
      var response = responses.splice(index, 1)[0]
      if (self._settings.http.roundRobin) {
        responses.push(response)
      }
      var structure = new HttpRequestResult()
      var properties = ['code', 'headers', 'data', 'raw_headers', 'text']
      properties.forEach(function (property) {
        if (response.hasOwnProperty(property)) {
          structure[property] = response[property]
        }
      })
      if (response.delay) {
        response.delay().then(callback.bind(null, structure))
      } else {
        callback(structure)
      }
    },
    httpRequestAsync: function (self, url, options) {
      return new Promise(function (resolve) {
        definition.handlers.httpRequest(self, url, resolve, options)
      })
    }
  }
}

module.exports = {
  Net: Factory.create('Net', definition)
}
