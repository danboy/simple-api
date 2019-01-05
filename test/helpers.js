const Promise = require('bluebird')
const faker = require('faker')
const crypto = require('crypto')
const Auth = require('../app/services/auth')

function generateActivityMeta (attrs = {}) {
  let createdAt = faker.date.recent()
  let defaults = {
    id: faker.random.uuid(),
    created_at: createdAt,
    updated_at: createdAt
  }

  return { ...defaults, ...attrs }
}

function generateAddressMeta (attrs = {}) {
  let a = faker.address
  let defaults = {
    text: `${a.streetAddress()}\n${a.city()}, ${a.stateAbbr()} ${a.zipCode()}`,
    type: 'primary'
  }

  return { ...defaults, ...attrs }
}

function generateUserMeta (attrs = {}) {
  let firstName = faker.name.firstName()
  let defaults = {
    full_name: `${firstName} ${faker.name.lastName()}`,
    common_name: firstName,
    email: faker.internet.email(),
    password: faker.internet.password(),
    phone: faker.phone.phoneNumber(),
    status: 'active',
    slug: faker.random.alphaNumeric(10)
  }

  return { ...defaults, ...attrs }
}

function random (items) {
  return items[Math.floor(Math.random() * items.length)]
}

function uuid () {
  return faker.random.uuid()
}

function getTokenFor (someUser) {
  return Auth.getToken({
    user_id: someUser.id,
    issuer: process.env.ISSUER,
    subject: someUser.email,
    audience: 'app'
  })
}

module.exports = {
  generateUserMeta,
  getTokenFor,
  random,
  uuid
}
