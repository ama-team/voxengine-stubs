/* eslint-env mocha */

var Sinon = require('sinon')
var Chai = require('chai')
var expect = Chai.expect

var Manager = require('../../../lib/Manager').Manager

describe('Integration', function () {
  describe('/Manager.js', function () {
    describe('.Manager', function () {
      var context
      var instance
      beforeEach(function () {
        context = {}
        instance = new Manager(context)
      })

      describe('#install()', function () {
        it('install symbols in context', function () {
          instance.install()
          expect(context).to.have.property('Logger')
        })

        it('is idempotent', function () {
          context.Logger = {write: Sinon.stub()}
          instance.install()
          var stash = instance._stash
          instance.install()
          instance.install()
          expect(instance._stash).to.deep.eq(stash)
        })
      })

      describe('#uninstall()', function () {
        it('uninstalls symbols from context', function () {
          instance.install()
          instance.uninstall()
          expect(context).not.to.have.property('Logger')
        })

        it('is idempotent', function () {
          instance.install()
          instance.uninstall()
          instance.uninstall()
          var logger = {write: Sinon.stub()}
          context.Logger = logger
          instance.uninstall()
          expect(context.Logger).eq(logger)
        })
      })

      describe('#reset()', function () {
        it('sends #_reset() call for all applicable symbols', function () {
          instance.install()
          var replacement = 'oh wow'
          context.Logger.write(replacement)
          context.Logger._state = replacement
          expect(context.Logger.write.callCount).to.eq(1)
          instance.reset()
          expect(context.Logger.write.callCount).to.eq(0)
          expect(context.Logger._state).not.to.eq(replacement)
        })
      })

      describe('< lifecycle', function () {
        it('allows any amount of #install() calls', function () {
          var logger = {write: Sinon.stub()}
          context.Logger = logger
          instance.install()
          instance.install()
          instance.install()
          instance.uninstall()
          expect(context.Logger).to.eq(logger)
        })

        it('allows any amount of #uninstall() calls', function () {
          var logger = {write: Sinon.stub()}
          context.Logger = logger
          instance.install()
          instance.uninstall()
          instance.uninstall()
          instance.uninstall()
          expect(context.Logger).to.eq(logger)
        })
      })
    })
  })
})
