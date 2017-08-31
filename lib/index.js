var Manager = require('./Manager')
var DefaultManager = new Manager()

/**
 * @type {IStubManager}
 */
var exported = {
  Mocks: require('./Stub'),
  Manager: Manager
}
Object.keys(DefaultManager).forEach(function (name) {
  var property = DefaultManager[name]
  if (typeof property === 'function') {
    exported[name] = function () {
      DefaultManager[name].apply(DefaultManager, arguments)
    }
  }
})

module.exports = exported
