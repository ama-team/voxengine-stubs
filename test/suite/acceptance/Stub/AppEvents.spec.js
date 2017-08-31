/* eslint-env mocha */

var Chai = require('chai')
var expect = Chai.expect

var AppEvents = require('../../../../lib/Stub/AppEvents').AppEvents

describe('Acceptance', function () {
  describe('/Stub', function () {
    describe('/AppEvents.js', function () {
      describe('.AppEvents', function () {
        Object.keys(AppEvents).forEach(function (name) {
          describe('.' + name, function () {
            describe('< new', function () {
              var Event = AppEvents[name]
              it('creates ' + name + ' without any passed properties', function () {
                var lambda = function () {
                  return new Event()
                }
                expect(lambda).not.to.throw()
              })

              AppEvents[name]._properties.forEach(function (property) {
                it('provides default value for property `' + property + '`', function () {
                  expect(new Event()).to.have.property(property)
                })

                it('sets property `' + property + '`', function () {
                  var input = {}
                  var value = {x: 12}
                  input[property] = value
                  var event = new Event(input)
                  expect(event).to.have.property(property).eq(value)
                })
              })

              it('doesn\'t set `name` property', function () {
                var value = {x: 12}
                var event = new Event({name: value})
                expect(event.name).not.to.eq(value)
              })

              it('sets arbitrary property', function () {
                var value = {x: 12}
                var property = 'wharrgarbl'
                var input = {}
                input[property] = value
                expect(new Event(input)).to.have.property(property).eq(value)
              })
            })
          })
        })
      })
    })
  })
})
