/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

var Sinon = require('sinon')
var Chai = require('chai')
var expect = Chai.expect

var VoxEngine = require('../../../../lib/Stub/VoxEngine').VoxEngine

describe('Integration', function () {
  describe('/Stub', function () {
    describe('/VoxEngine.js', function () {
      describe('.Logger', function () {
        var instance
        var allure
        var allureOptions = {
          mimeType: 'application/json',
          filename: 'secrets.json'
        }

        beforeEach(function () {
          allure = global.allure
          global.allure = {
            createAttachment: Sinon.stub()
          }
          instance = new VoxEngine()
        })

        afterEach(function () {
          global.allure = allure
        })

        describe('#customData()', function () {
          it('writes data into `._state` and retrieves it', function () {
            expect(instance._state.customData).to.be.not.ok
            var value = 'wow'
            instance.customData(value)
            expect(instance._state.customData).to.eq(value)
            expect(instance.customData()).to.eq(value)
          })

          it('returns default value by default', function () {
            var value = {x: 12}
            instance._setup({customData: {default: value}})
            expect(instance.customData()).to.eq(value)
          })
        })

        describe('#addEventListener()', function () {
          it('adds new listener', function () {
            var event = {name: 'event'}
            var listener = Sinon.stub()
            instance.addEventListener(event, listener)
            expect(instance._state.listeners[event.name]).to.contain(listener)
            instance._emit(event)
            expect(listener.callCount).to.eq(1)
            expect(listener.getCall(0).args[0]).to.eq(event)
          })
        })

        describe('#removeEventListener()', function () {
          it('removes only listener', function () {
            var event = {name: 'event'}
            var listener = Sinon.stub()
            instance.addEventListener(event, listener)
            instance.removeEventListener(event, listener)
            expect(instance._state.listeners).not.to.have.property(event.name)
          })

          it('removes single listener', function () {
            var event = {name: 'event'}
            var listenerA = Sinon.stub()
            var listenerB = Sinon.stub()
            instance.addEventListener(event, listenerA)
            instance.addEventListener(event, listenerB)
            instance.removeEventListener(event, listenerA)
            expect(instance._state.listeners).to.have.property(event.name).contain(listenerB)
          })

          it('removes all listeners', function () {
            var event = {name: 'event'}
            var listeners = [Sinon.stub(), Sinon.stub()]
            listeners.forEach(instance.addEventListener.bind(instance, event))
            instance.removeEventListener(event)
            expect(instance._state.listeners).not.to.have.property(event.name)
          })

          it('doesn\'t take any action if handler is not registered', function () {
            var event = {name: 'event'}
            var registered = Sinon.stub()
            instance.addEventListener(event, registered)
            instance.removeEventListener(event, Sinon.stub())
            instance._emit(event)
            expect(registered.callCount).to.eq(1)
          })

          it('doesn\'t take any action if any handler hasn\'t been registered', function () {
            var event = {name: 'event'}
            instance.removeEventListener(event, Sinon.stub())
            var lambda = function () {
              instance._emit(event)
            }
            expect(lambda).not.to.throw()
          })
        })

        describe('#_flush()', function () {
          it('doesn\'t save allure attachments if it is disabled', function () {
            instance = new VoxEngine({allure: {enabled: false}})
            instance.customData('wow')
            instance._flush()
            expect(global.allure.createAttachment.callCount).to.eq(0)
          })

          it('doesn\'t save allure attachments if it is missing', function () {
            global.allure = null
            instance.customData('wow')
            expect(instance._flush).not.to.throw()
          })

          it('saves customData log', function () {
            var options = {
              allure: {
                customData: allureOptions
              }
            }
            instance = new VoxEngine(options)
            instance.customData(12)
            instance._flush()
            var handler = global.allure.createAttachment
            expect(handler.callCount).to.eq(1)
            expect(handler.getCall(0).args[0]).to.eq(allureOptions.filename)
            expect(handler.getCall(0).args[2]).to.eq(allureOptions.mimeType)
          })

          it('saves event log', function () {
            var options = {
              allure: {
                events: allureOptions
              }
            }
            instance = new VoxEngine(options)
            instance._emit({name: 'event'})
            instance._flush()
            var handler = global.allure.createAttachment
            expect(handler.callCount).to.eq(1)
            expect(handler.getCall(0).args[0]).to.eq(allureOptions.filename)
            expect(handler.getCall(0).args[2]).to.eq(allureOptions.mimeType)
          })

          it('saves event listeners log', function () {
            var options = {
              allure: {
                listeners: allureOptions
              }
            }
            instance = new VoxEngine(options)
            var event = {name: 'event'}
            instance.addEventListener(event, function () {})
            instance.removeEventListener(event)
            instance._flush()
            var handler = global.allure.createAttachment
            expect(handler.callCount).to.eq(1)
            expect(handler.getCall(0).args[0]).to.eq(allureOptions.filename)
            expect(handler.getCall(0).args[2]).to.eq(allureOptions.mimeType)
          })
        })

        describe('.terminate()', function () {
          it('throws on multiple calls if `.throwOnMultipleCalls` is set to true', function () {
            var options = {
              throwOnMultipleCalls: true,
              throwOnLostContext: false
            }
            instance._setup({terminate: options})
            instance._reset()
            expect(instance.terminate).not.to.throw()
            expect(instance.terminate).to.throw()
          })

          it('doesn\'t throw on multiple calls if `.throwOnMultipleCalls` is set to false', function () {
            var options = {
              throwOnMultipleCalls: false,
              throwOnLostContext: false
            }
            instance._setup({terminate: options})
            instance._reset()
            expect(instance.terminate).not.to.throw()
            expect(instance.terminate).not.to.throw()
          })

          it('throws on lost `this` if `.throwOnLostContext` is set to true', function () {
            instance._setup({terminate: {throwOnLostContext: true}})
            instance._reset()
            expect(instance.terminate).to.throw()
          })

          it('doesn\'t throw on lost `this` if `.throwOnLostContext` is set to false', function () {
            instance._setup({terminate: {throwOnLostContext: false}})
            instance._reset()
            expect(instance.terminate).not.to.throw()
          })
        })
      })
    })
  })
})
