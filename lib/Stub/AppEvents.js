var AppEvents = {}

function factory (name, defaults) {
  defaults = defaults || {}
  var fullName = 'Application.' + name
  var event = function (data) {
    var self = this
    data = data || {}
    Object.defineProperty(this, 'name', {value: fullName, writable: false})
    Object.keys(defaults).forEach(function (key) {
      self[key] = defaults[key]
    })
    Object.keys(data).forEach(function (key) {
      self[key] = data[key]
    })
  }
  Object.defineProperty(event, 'name', {value: fullName, writable: false})
  event._properties = Object.keys(defaults)
  AppEvents[name] = event
}

factory('CallAlerting', {
  call: {},
  callerid: null,
  customData: '',
  destination: '',
  displayName: '',
  fromURI: '',
  headers: {},
  toURI: ''
})
factory('HttpRequest', {content: '', method: 'POST', path: '/'})
factory('Started', {accessURL: ''})
factory('Terminating')
factory('Terminated')

module.exports = {
  AppEvents: AppEvents
}
