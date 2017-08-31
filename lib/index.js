var Manager = require('./Manager').Manager
var defaultManager = new Manager()

/**
 * @type {IStubManager}
 */
var exported = {
  Stubs: require('./Stub'),
  Manager: Manager,
  defaultManager: defaultManager
}
Object.keys(defaultManager).forEach(function (name) {
  var property = defaultManager[name]
  if (typeof property === 'function') {
    exported[name] = function () {
      defaultManager[name].apply(defaultManager, arguments)
    }
  }
})

/**
 * @type {IStubManager}
 */
module.exports = exported
