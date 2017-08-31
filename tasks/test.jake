var Support = require('./Support')
var Workspace = require('./Workspace')
var Path = require('path')
var Mocha = require('mocha')
var glob = require('glob')

namespace('test', function () {
  Workspace.suites.forEach(function (suite) {
    task(suite, {async: true}, function (pattern) {
      var options = {
        reporter: 'mocha-multi-reporters',
        reporterOptions: {
          reporterEnabled: 'spec, xunit, mocha-junit-reporter, mocha-allure-reporter',
          mochaAllureReporterReporterOptions: {
            targetDir: Path.resolve(Workspace.allure.metadata, suite)
          },
          xunitReporterOptions: {
            output: Path.resolve(Workspace.xunit.metadata, suite, 'xunit.xml')
          },
          mochaJunitReporterReporterOptions: {
            mochaFile: Path.resolve(Workspace.junit.metadata, suite, 'TEST-' + suite + '.xml')
          }
        },
        slow: 10,
        timeout: 200
      }
      var suiteDirectory = Path.resolve(Workspace.test.suites, suite)
      if (pattern) {
        options['grep'] = new RegExp(pattern, 'i')
      }
      glob(Path.resolve(suiteDirectory, '**', '*.spec.js'), function (error, files) {
        if (error) {
          return fail(error)
        }
        var mocha = new Mocha(options)
        mocha.addFile(Path.resolve(Workspace.test.support, 'setup.js'))
        for (var i = 0; i < files.length; i++) {
          mocha.addFile(files[i])
        }
        mocha.run(function (failures) {
          failures === 0 ? complete(0) : fail(failures)
        })
      })
    })
  })
})

task('test', {async: true}, function () {
  var tasks = Workspace.suites.map(function (suite) {
    return 'test:' + suite
  })
  Support.chain(tasks)
})
