var Support = require('./Support')
var Workspace = require('./Workspace')
var Path = require('path')

namespace('test', function () {
  task('coverage', {async: true}, function () {
    var tasks = Workspace.suites.map(function (suite) {
      return 'test:' + suite + ':coverage'
    })
    tasks.unshift('test:clean')
    Support.chain(tasks)
  })

  Workspace.suites.forEach(function (suite) {
    namespace(suite, function () {
      task('coverage', {async: true}, function () {
        var command = [
          Support.executable('istanbul'),
          'cover',
          '--dir',
          Path.resolve(Workspace.coverage.metadata, suite),
          '--report',
          'none',
          Support.executable('jake'),
          'test:' + suite
        ];
        Support.supersede(command)
      })
    })
  })
})
