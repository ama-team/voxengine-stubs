var Path = require('path')
var FileSystem = require('fs')

var root = Path.join(__dirname, 'tasks')
FileSystem.readdirSync(root).forEach(function (entry) {
  if (entry.indexOf('.jake') === entry.length - 5) {
    require(Path.resolve(root, entry))
  }
})
