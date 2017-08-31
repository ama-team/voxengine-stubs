/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

var Sinon = require('sinon')
var Chai = require('chai')
var expect = Chai.expect

var Logger = require('../../../../lib/Stub/Logger').Logger

describe('Integration', function () {
  describe('/Stub', function () {
    describe('/Logger.js', function () {
      describe('.Logger', function () {
        var instance
        var allure

        beforeEach(function () {
          allure = global.allure
          global.allure = {
            createAttachment: Sinon.stub()
          }
          instance = new Logger()
        })

        afterEach(function () {
          global.allure = allure
        })

        describe('#write()', function () {
          it('writes every message into `._state`', function () {
            expect(instance._state.messages).to.be.empty
            var message = 'wow'
            instance.write(message)
            expect(instance._state.messages[0].message).to.eq(message)
          })
        })

        describe('#_flush()', function () {
          it('saves everything as allure attachment', function () {
            var filename = 'voxengine.json'
            var type = 'application/json'
            var options = {filename: filename, mimeType: type}
            var msg = 'wow'
            instance = new Logger({allure: options})
            instance.write(msg)
            instance._flush()
            var handler = global.allure.createAttachment
            expect(handler.callCount).to.eq(1)
            expect(handler.getCall(0).args[0]).to.eq(filename)
            expect(handler.getCall(0).args[1]).to.contain(msg)
            expect(handler.getCall(0).args[2]).to.eq(type)
          })

          it('doesn\'t save allure attachment if it is disabled', function () {
            instance = new Logger({allure: {enabled: false}})
            instance.write('wow')
            instance._flush()
            expect(global.allure.createAttachment.callCount).to.eq(0)
          })

          it('doesn\'t save allure attachment if it is missing', function () {
            global.allure = null
            instance.write('wow')
            expect(instance._flush).not.to.throw()
          })
        })
      })
    })
  })
})
