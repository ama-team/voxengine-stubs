/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

var Sinon = require('sinon')
var Chai = require('chai')
var expect = Chai.expect

Chai.use(require('chai-as-promised'))

var Net = require('../../../../lib/Stub/Net').Net

describe('Integration', function () {
  describe('/Stub', function () {
    describe('/Net.js', function () {
      describe('.Net', function () {
        describe('.httpRequestAsync', function () {
          var options
          var instance
          var response

          beforeEach(function () {
            response = {
              code: 200,
              headers: []
            }
            options = {
              http: {
                responses: [response]
              }
            }
            autoFactory()
          })

          var autoFactory = function () {
            instance = new Net(options)
            return instance
          }

          it('uses first response if it has no matcher', function () {
            options.http.responses = [{code: 200}]
            autoFactory()
            return instance
              .httpRequestAsync('test')
              .then(function (value) {
                expect(value).to.have.property('code').eq(response.code)
              })
          })

          it('uses next response if first didn\'t match', function () {
            var expectedCode = 200
            options.http.responses = [
              {
                code: 404,
                matcher: function () {
                  return false
                }
              },
              {
                code: expectedCode,
                matcher: function () {
                  return true
                }
              }
            ]
            autoFactory()
            return instance
              .httpRequestAsync('test')
              .then(function (value) {
                expect(value).to.have.property('code').eq(expectedCode)
              })
          })

          it('throws if no responses have matched', function () {
            options.http.responses = []
            autoFactory()
            var promise = instance.httpRequestAsync('url')
            return expect(promise).to.eventually.be.rejected
          })

          it('discards response if roundRobin is turned off', function () {
            options.http.roundRobin = false
            autoFactory()
            return instance
              .httpRequestAsync('url')
              .then(function () {
                var promise = instance.httpRequestAsync('url')
                return expect(promise).to.eventually.be.rejected
              })
          })

          it('places response in the end if roundRobin is turned on', function () {
            options.http.roundRobin = true
            options.http.responses = [
              {code: 200},
              {code: 201}
            ]
            autoFactory()
            return instance
              .httpRequestAsync('url')
              .then(function (response) {
                expect(response.code).to.eq(200)
                return instance.httpRequestAsync('url')
              })
              .then(function (response) {
                expect(response.code).to.eq(201)
                return instance.httpRequestAsync('url')
              })
              .then(function (response) {
                expect(response.code).to.eq(200)
              })
          })

          it('uses 200 as default code', function () {
            response = {}
            autoFactory()
            return instance
              .httpRequestAsync('url')
              .then(function (value) {
                expect(value.code).to.eq(200)
              })
          })

          it('respects provided delay', function () {
            var handler = Sinon.spy(function () {
              return Promise.resolve()
            })
            options.http.responses = [
              {delay: handler}
            ]
            autoFactory()
            return instance
              .httpRequestAsync('url')
              .then(function () {
                expect(handler.callCount).to.eq(1)
              })
          })
        })

        describe('.HttpRequestOptions', function () {
          it('is instantiable', function () {
            var lambda = function () {
              var net = new Net()
              return new net.HttpRequestOptions()
            }
            expect(lambda).not.to.throw()
          })
        })
      })
    })
  })
})
