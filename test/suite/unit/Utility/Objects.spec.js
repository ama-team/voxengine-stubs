/* eslint-env mocha */
/* global allure */

var Chai = require('chai')
var expect = Chai.expect

var Objects = require('../../../../lib/Utility/Objects').Objects

describe('Unit', function () {
  describe('/Utility', function () {
    describe('/Objects.js', function () {
      describe('.Objects', function () {
        describe('.copy', function () {
          var variants = [1, 1.0, true, false, null, undefined, 'string']
          variants.forEach(function (value) {
            it('passes through primitive value', function () {
              allure.addArgument('input', value)
              expect(Objects.copy(value)).to.equal(value)
            })
          })

          it('copies array contents', function () {
            var value = [1, 2, 3]
            var copy = Objects.copy(value)
            expect(copy).not.to.equal(value)
            expect(copy).to.deep.eq(value)
          })
        })

        describe('.merge', function () {
          // TODO: write tests for all cases
        })
      })
    })
  })
})
