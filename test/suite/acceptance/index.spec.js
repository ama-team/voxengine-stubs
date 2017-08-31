/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

var Sinon = require('sinon')
var Chai = require('chai')
var expect = Chai.expect

var Stubs = require('../../../lib')
var Logger = Stubs.Stubs.Logger

describe('Acceptance', function () {
  describe('/index.js', function () {
    var stash = {}
    var symbols = ['allure', 'VoxEngine', 'Logger', 'Net', 'CallEvents', 'AppEvents']

    function save () {
      symbols.forEach(function (symbol) {
        if (global.hasOwnProperty(symbol)) {
          stash[symbol] = global[symbol]
        }
      })
    }

    function restore () {
      symbols.forEach(function (symbol) {
        if (stash.hasOwnProperty(symbol)) {
          global[symbol] = stash[symbol]
          delete stash[symbol]
        } else {
          delete global[symbol]
        }
      })
    }

    beforeEach(function () {
      save()
      global.allure = {
        createAttachment: Sinon.stub()
      }
    })

    afterEach(function () {
      restore()
    })

    describe('< default lifecycle', function () {
      it('installs and uninstalls global handlers', function () {
        expect(global).not.to.have.property('Logger')
        Stubs.install()
        expect(global).to.have.property('Logger').instanceOf(Logger)
        Stubs.uninstall()
      })

      it('propagates it\'s configuration', function () {
        Stubs.install()
        Stubs.setup({global: {allure: {enabled: true}}})
        expect(global.Logger._settings.allure.enabled).to.be.true
        Stubs.setup({global: {allure: {enabled: false}}})
        expect(global.Logger._settings.allure.enabled).to.be.false
        Stubs.uninstall()
      })

      it('returns previous values after uninstall', function () {
        var Logger = {write: Sinon.stub()}
        global.Logger = Logger
        Stubs.install()
        expect(global.Logger).not.to.eq(Logger)
        Stubs.uninstall()
        expect(global.Logger).to.eq(Logger)
      })
    })

    describe('.reset()', function () {
      beforeEach(Stubs.install)
      afterEach(Stubs.uninstall)

      it('propagates to installed symbols', function () {
        global.Logger.write('once')
        expect(global.Logger.write.callCount).to.eq(1)
        Stubs.reset()
        expect(global.Logger.write.callCount).to.eq(0)
      })
    })

    describe('.flush()', function () {
      beforeEach(Stubs.install)
      afterEach(Stubs.uninstall)

      it('propagates to installed symbols', function () {
        Stubs.setup({global: {allure: {enabled: true}}})
        global.Logger.write('once')
        Stubs.flush()
        expect(global.allure.createAttachment.callCount).to.eq(1)
      })
    })
  })
})
