var Support = require('./Support')
var Workspace = require('./Workspace')
var Path = require('path')

namespace('test', function () {
  namespace('report', function () {
    task('allure', {async: true}, function () {
      var command = [
        'allure',
        'generate',
        '--clean',
        '-o',
        Workspace.allure.report,
        '--',
        Path.resolve(Workspace.allure.metadata, '**')
      ]
      Support.supersede(command)
    })
  })
})
