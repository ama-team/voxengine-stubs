/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

var Sinon = require('sinon')
var Chai = require('chai')
var expect = Chai.expect

var VoxEngine = require('../../../../lib/Stub/VoxEngine').VoxEngine

describe('Acceptance', function () {
  describe('/Stub', function () {
    describe('/VoxEngine.js', function () {
      describe('.Logger', function () {
        var instance
        var allure

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
        })
      })
    })
  })
})
