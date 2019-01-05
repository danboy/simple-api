const Promise = require('bluebird')
const assert = require('assert')
const m = require('../../app/models')
const User = m.User
const { generateActivityMeta, generateAddressMeta, generateUserMeta } = require('../helpers')

describe('User', function () {
  after(() => {
    return Promise.join(
      User.destroy({ truncate: true }),
      m.Address.destroy({ truncate: true })
    )
  })

  afterEach(() => {
    m.Activity.destroy({ truncate: true })
  })

})
