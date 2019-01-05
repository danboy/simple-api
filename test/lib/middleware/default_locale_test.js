const assert = require('assert')
const defaultLocaleInfo = require('../../../app/lib/middleware/default_locale_info')

describe('Middleware: defaultLocale', () => {
  let req, res, next, defaultLocale

  beforeEach(() => {
    req = { body: {} }
    next = () => {}
    defaultLocale = defaultLocaleInfo({ locale: 'EN', countryCode: 'US' })
  })

  describe('when params do not exist on request body', () => {
    it('sets the "locale" attribute on the body to the provided default', () => {
      defaultLocale(req, res, next)

      assert.strictEqual('EN', req.body.locale)
      assert.strictEqual('US', req.body.countryCode)
    })

    it('calls the next middleware', () => {
      let next = () => { throw new Error('exploding middleware!') }
      let mw = () => { defaultLocale(req, res, next) }

      assert.throws(mw, /exploding middleware!/)
    })
  })

  describe('when params exist on request body', () => {
    beforeEach(() => {
      req.body.locale = 'XY'
      req.body.countryCode = 'ZZ'
    })

    it('does not change the "locale" attribute on the body', () => {
      defaultLocale(req, res, next)

      assert.strictEqual('XY', req.body.locale)
      assert.strictEqual('ZZ', req.body.countryCode)
    })

    it('calls the next middleware', () => {
      let next = () => { throw new Error('exploding middleware!') }
      let mw = () => { defaultLocale(req, res, next) }

      assert.throws(mw, /exploding middleware!/)
    })
  })
})
