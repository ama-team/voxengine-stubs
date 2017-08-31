var Path = require('path')

var root = Path.resolve(__dirname, '../..')
var tmpDirectory = Path.resolve(root, 'tmp')
var metadataDirectory = Path.resolve(tmpDirectory, 'metadata')
var reportDirectory = Path.resolve(tmpDirectory, 'report')
var testDirectory = Path.resolve(root, 'test')

/**
 * @param {string} name
 * @return {{report: string, metadata: string}}
 */
function toolPaths (name) {
  return {
    report: Path.resolve(reportDirectory, name),
    metadata: Path.resolve(metadataDirectory, name)
  }
}

module.exports = {
  root: root,
  tmp: tmpDirectory,
  modules: Path.join(root, 'node_modules'),
  report: reportDirectory,
  metadata: metadataDirectory,
  allure: toolPaths('allure'),
  junit: toolPaths('junit'),
  xunit: toolPaths('xunit'),
  coverage: toolPaths('coverage'),
  test: {
    suites: Path.resolve(testDirectory, 'suite'),
    support: Path.resolve(testDirectory, 'support')
  },
  suites: ['unit', 'integration', 'acceptance']
}
