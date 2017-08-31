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
          var variantSetA = {
            number: 1.0,
            boolean: true,
            function: function () {}
          }
          Object.keys(variantSetA).forEach(function (key) {
            it('returns b if b is a ' + key, function () {
              var value = variantSetA[key]
              expect(Objects.merge({}, value)).to.eq(value)
            })

            it('returns b if a is a ' + key, function () {
              var value = variantSetA[key]
              var b = {}
              expect(Objects.merge(value, b)).to.eq(b)
            })
          })

          var variantSetB = {
            null: null,
            undefined: undefined
          }

          Object.keys(variantSetB).forEach(function (key) {
            it('returns a if b is a ' + key, function () {
              var a = {}
              expect(Objects.merge(a, variantSetB[key])).to.eq(a)
            })

            it('returns b if a is a ' + key, function () {
              var b = {}
              expect(Objects.merge(variantSetB[key], b)).to.eq(b)
            })
          })

          it('returns b if a is array', function () {
            var b = {}
            expect(Objects.merge([], b)).to.eq(b)
          })

          it('returns b if b is array', function () {
            var b = []
            expect(Objects.merge({}, b)).to.eq(b)
          })

          it('writes disjoint keys', function () {
            var a = {x: 12}
            var b = {y: 13}
            var expectation = {x: 12, y: 13}
            expect(Objects.merge(a, b)).to.deep.eq(expectation)
          })

          it('overwrites intersecting key', function () {
            var a = {x: 12}
            var b = {x: 13}
            expect(Objects.merge(a, b)).to.deep.eq(b)
          })

          it('overwrites intersecting keys recursively', function () {
            var a = {x: {y: 12}}
            var b = {x: {z: 13}}
            var expectation = {x: {y: 12, z: 13}}
            expect(Objects.merge(a, b)).to.deep.eq(expectation)
          })
        })
      })
    })
  })
})
