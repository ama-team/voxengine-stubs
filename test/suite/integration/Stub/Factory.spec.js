/* eslint-env mocha */

var Sinon = require('sinon')
var Chai = require('chai')
var expect = Chai.expect

var Factory = require('../../../../lib/Stub/Factory').Factory

describe('Integration', function () {
  describe('/Stub', function () {
    describe('/Factory.js', function () {
      describe('.Factory', function () {
        describe('.create()', function () {
          var handlers
          var properties
          var state
          var onFlush
          var Stub

          var factory = function (settings, symbol) {
            return Factory.create(symbol || 'Stub', settings)
          }

          var autoFactory = function (symbol) {
            var settings = {
              handlers: handlers,
              properties: properties,
              state: state,
              onFlush: onFlush
            }
            Stub = factory(settings, symbol)
            return Stub
          }

          var autoStub = function (symbol) {
            autoFactory(symbol)
            return new Stub()
          }

          it('creates instantiable stub class', function () {
            autoFactory()
            var lambda = function () {
              return new Stub()
            }
            expect(lambda).not.to.throw()
          })

          it('installs provided state', function () {
            state = {x: 12}
            expect(autoStub()).to.have.property('_state').deep.eq(state)
          })

          it('installs provided properties', function () {
            var property = {x: 12}
            properties = {prop: property}
            expect(autoStub()).to.have.property('prop').deep.eq(property)
          })

          it('installs provided handlers', function () {
            var handler = Sinon.spy(function () {})
            handlers = {handler: handler}
            var stub = autoStub()
            expect(stub).to.have.property('handler').instanceOf(Function)
            var arg = {x: 12}
            var thisValue = {x: 13}
            stub.handler.call(thisValue, arg)
            expect(stub.handler.callCount).to.eq(1)
            expect(handler.callCount).to.eq(1)
            expect(handler.getCall(0).args[0]).to.eq(stub)
            expect(handler.getCall(0).args[1]).to.eq(arg)
            expect(handler.getCall(0).thisValue).to.eq(thisValue)
          })

          it('reverts handlers on ._reset()', function () {
            var handler = Sinon.spy(function () {})
            handlers = {handler: handler}
            var stub = autoStub()
            expect(stub).to.have.property('handler').instanceOf(Function)
            stub.handler()
            expect(stub.handler.callCount).to.eq(1)
            expect(handler.callCount).to.eq(1)
            stub._reset()
            stub.handler()
            expect(stub.handler.callCount).to.eq(1)
            expect(handler.callCount).to.eq(2)
          })

          it('resets state on ._reset()', function () {
            state = {x: 12}
            var stub = autoStub()
            stub._state = 'twenty'
            stub._reset()
            expect(stub._state).to.deep.eq(state)
          })

          it('installs provided onFlush handler', function () {
            onFlush = Sinon.spy(function () {})
            var stub = autoStub()
            stub._flush()
            expect(onFlush.callCount).to.be.at.least(1)
            expect(onFlush.getCall(0).args[0]).to.eq(stub)
          })

          it('creates _flush even without provided handler', function () {
            expect(autoStub()._flush).not.to.throw()
          })
        })
      })
    })
  })
})
