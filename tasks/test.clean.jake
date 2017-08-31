var FileSystem = require('fs-extra')
var Support = require('./Support')
var Workspace = require('./Workspace')

namespace('test', function () {
  task('clean', {async: true}, function () {
    var paths = [Workspace.metadata, Workspace.report]
    var jobs = paths.map(function (path) {
      return FileSystem.emptyDir(path)
    })
    return Support.promise(Promise.all(jobs))
  })
})
