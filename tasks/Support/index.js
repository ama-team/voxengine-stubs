/* global jake, complete, fail */
var Path = require('path')

var Workspace = require('../Workspace')

var Support = {
  exec: function (args) {
    return new Promise(function (resolve, reject) {
      var options = {printStdout: true, printStderr: true, breakOnError: false}
      var exec = jake.exec(args.join(' '), options, resolve)
      exec.addListener('error', reject)
    })
  },
  supersede: function (args) {
    Support.promise(Support.exec(args))
  },
  chain: function (tasks, suppressErrors, callback) {
    var errors = []
    callback = callback || function (error, value) {
      error ? fail(error) : complete(value)
    }
    tasks = tasks.map(function (task) {
      if (typeof task === 'string' || task instanceof String) {
        return jake.Task[task]
      }
      return task
    })
    var first = tasks.shift()
    var last = tasks.reduce(function (carrier, task) {
      carrier.addListener('complete', task.invoke.bind(task))
      carrier.addListener('fail', function (error) {
        if (!suppressErrors) {
          return fail(error)
        }
        errors.push(error)
        task.invoke()
      })
      return task
    }, first)
    last.addListener('complete', function (value) {
      callback(errors.pop(), value)
    })
    last.addListener('fail', callback)
    first.invoke()
  },
  promise: function (promise) {
    promise.then(complete, setTimeout.bind(global, fail, 0))
  },
  executable: function (name) {
    return Path.join(Workspace.modules, '.bin', name)
  }
}

module.exports = Support
