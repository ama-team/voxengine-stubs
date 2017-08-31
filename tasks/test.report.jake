var Support = require('./Support')

namespace('test', function () {
  task('report', function () {
    Support.chain(['test:report:coverage', 'test:report:allure'])
  })
})
