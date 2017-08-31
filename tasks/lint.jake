var Support = require('./Support')

task('lint', function () {
  Support.supersede(['node_modules/.bin/standard'])
})
