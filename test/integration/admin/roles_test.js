const Promise = require('bluebird')
const request = require('supertest')
const assert = require('assert')
const m = require('../../../app/models')
const app = require('../../../')
const h = require('../../helpers')

describe('Administering Roles', () => {
  let standardActor, adminActor, standardToken, adminToken

  beforeEach(() => {
    return Promise.join(
      m.User.create(h.generateUserMeta()),
      m.User.create(h.generateUserMeta()),
      m.Role.create({ name: 'Admin', slug: 'admin', description: 'Admin description' }),
      (stan, admin, role) => {
        standardActor = stan
        adminActor = admin

        return m.RoleAssignment.create({ actor_id: h.uuid(), user_id: adminActor.id, role_id: role.id })
        .then(() => {
          return Promise.join(
            h.getTokenFor(standardActor),
            h.getTokenFor(adminActor),
            (sToken, aToken) => {
              standardToken = sToken
              adminToken = aToken
            })
        })
      })
  })

  afterEach(() => {
    return Promise.all([
      m.User.destroy({ truncate: true }),
      m.Role.destroy({ truncate: true }),
      m.RoleAssignment.destroy({ truncate: true })
    ])
  })

  describe('retrieve_roles', () => {
    describe('when actor is not an admin', () => {
      let token

      beforeEach(() => {
        token = standardToken
      })

      it('sets a status code of 401 Unauthorized', (done) => {
        request(app)
          .get('/admin/roles')
          .set('Content-Type', 'application/json')
          .set('Authorization', `JWT ${token}`)
          .expect(401, done)
      })
    })

    describe('when actor is an admin', () => {
      let token

      beforeEach(() => {
        token = adminToken
      })

      it('sets a status code of 200', (done) => {
        request(app)
          .get('/admin/roles')
          .set('Content-Type', 'application/json')
          .set('Authorization', `JWT ${token}`)
          .expect(200, done)
      })
    })
  })

  describe('create_role', () => {
    function performRequest ({ token }) {
      return request(app)
        .post('/admin/roles')
        .set('Content-Type', 'application/json')
        .set('Authorization', `JWT ${token}`)
        .send({ name: 'Role Name', slug: 'role', description: 'A description' })
    }

    describe('when actor is not an admin', () => {
      it('sets a status code of 401 Unauthorized', (done) => {
        performRequest({ token: standardToken })
        .expect(401, done)
      })
    })

    describe('when actor is an admin', () => {
      it('sets a status code of 201', (done) => {
        performRequest({ token: adminToken })
        .expect(201, done)
      })

      it('sets the properties correctly', () => {
        return performRequest({ token: adminToken })
        .then(res => {
          return m.Role.findAll()
          .then(roles => {
            let newRole = roles[1]

            assert.strictEqual(newRole.name, 'Role Name')
            assert.strictEqual(newRole.description, 'A description')
            return assert.strictEqual(newRole.actor_id, adminActor.id)
          })
        })
      })
    })
  })

  describe('update_role', () => {
    function performRequest ({ token, slug, reqBody }) {
      return request(app)
        .put(`/admin/roles/${slug}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `JWT ${token}`)
        .send(reqBody)
    }

    beforeEach(() => {
      return m.Role.create({ name: 'Some Role', slug: 'some-role' })
    })

    describe('when actor is not an admin', () => {
      it('sets a status code of 401 Unauthorized', () => {
        return performRequest({ token: standardToken, slug: 'some-role' })
        .expect(401)
      })
    })

    describe('when actor is an admin', () => {
      it('updates properties', () => {
        let reqBody = { slug: 'new-slug', name: 'Renamed Role', description: 'Updated description' }

        return performRequest({ token: adminToken, slug: 'some-role', reqBody })
        .expect(200)
        .then(res => {
          return m.Role.findOne({ where: { slug: 'new-slug' } })
          .then(role => {
            assert.strictEqual(role.name, 'Renamed Role')
            return assert.strictEqual(role.description, 'Updated description')
          })
        })
      })

      it('refuses to update role with "admin" slug', () => {
        let reqBody = { slug: 'new-slug', name: 'Renamed Role', description: 'Updated description' }

        return performRequest({ token: adminToken, slug: 'admin', reqBody })
        .expect(403)
        .then(res => {
          return m.Role.findOne({ where: { slug: 'admin' } })
          .then(role => {
            assert.strictEqual(role.name, 'Admin')
            return assert.strictEqual(role.description, 'Admin description')
          })
        })
      })
    })
  })

  describe('delete_role', () => {
    function performRequest ({ token, slug }) {
      return request(app)
        .delete(`/admin/roles/${slug}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `JWT ${token}`)
    }

    beforeEach(() => {
      return m.Role.create({ name: 'Some Role', slug: 'some-role' })
      .then(r => { if (r.isNewRecord) throw new Error('test role not created!') })
    })

    describe('when actor is not an admin', () => {
      it('sets a status code of 401 Unauthorized', () => {
        return performRequest({ token: standardToken, slug: 'some-role' })
        .expect(401)
      })
    })

    describe('when actor is an admin', () => {
      it('sets a status code of 204 No Content', () => {
        return performRequest({ token: adminToken, slug: 'some-role' })
        .expect(204)
      })

      it('deletes the role with the specified slug', () => {
        return performRequest({ token: adminToken, slug: 'some-role' })
        .then(res => {
          return m.Role.findOne({ where: { slug: 'new-slug' } })
          .then(role => {
            return assert(!role)
          })
        })
      })

      it('refuses to delete role with "admin" slug', () => {
        return performRequest({ token: adminToken, slug: 'admin' })
        .expect(403)
        .then(res => {
          return m.Role.findOne({ where: { slug: 'admin' } })
          .then(role => {
            assert.strictEqual(role.name, 'Admin')
            return assert.strictEqual(role.description, 'Admin description')
          })
        })
      })
    })
  })

  describe('retrieve_role', () => {
    function performRequest ({ token, slug }) {
      return request(app)
        .get(`/admin/roles/${slug}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `JWT ${token}`)
    }

    describe('when actor is not an admin', () => {
      it('sets a status code of 401 Unauthorized', () => {
        return performRequest({ token: standardToken, slug: 'admin' })
        .expect(401)
      })
    })

    describe('when actor is an admin', () => {
      it('returns the role in the request body', () => {
        return performRequest({ token: adminToken, slug: 'admin' })
        .expect(200)
        .then(res => {
          assert.strictEqual(res.body.role.name, 'Admin')
          assert.strictEqual(res.body.role.slug, 'admin')
        })
      })
    })
  })

  describe('assign_user_role', () => {
    function performRequest ({ token, roleSlug, slug }) {
      return request(app)
        .put(`/admin/roles/${roleSlug}/users/${slug}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `JWT ${token}`)
    }

    describe('when actor is not an admin', () => {
      it('sets a status code of 401 Unauthorized', () => {
        return performRequest({ token: standardToken, roleSlug: 'admin', slug: 'some-slug' })
        .expect(401)
      })
    })

    describe('when actor is an admin', () => {
      it('sets a status code of 204 No Content', () => {
        return performRequest({ token: adminToken, roleSlug: 'admin', slug: standardActor.slug })
        .expect(204)
      })

      it('assigns the specified role to the specified user', () => {
        return performRequest({ token: adminToken, roleSlug: 'admin', slug: standardActor.slug })
        .then(res => {
          return standardActor.reload({ include: [{ model: m.Role, as: 'roles' }] })
          .then(p => {
            let assignedRoleSlugs = p.roles.map(r => { return r.slug })

            return assert(assignedRoleSlugs.indexOf('admin') !== -1, 'admin role was not assigned!')
          })
        })
      })
    })
  })

  describe('revoke_user_role', () => {
    function performRequest ({ token, roleSlug, slug }) {
      return request(app)
        .delete(`/admin/roles/${roleSlug}/users/${slug}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `JWT ${token}`)
    }

    describe('when actor is not an admin', () => {
      it('sets a status code of 401 Unauthorized', () => {
        return performRequest({ token: standardToken, roleSlug: 'admin', slug: 'some-slug' })
        .expect(401)
      })
    })

    describe('when actor is an admin', () => {
      it('sets a status code of 204 No Content', () => {
        return performRequest({ token: adminToken, roleSlug: 'admin', slug: standardActor.slug })
        .expect(204)
      })

      it('assigns the specified role to the specified user', () => {
        return performRequest({ token: adminToken, roleSlug: 'admin', slug: adminActor.slug })
        .then(res => {
          return adminActor.reload({ include: [{ model: m.Role, as: 'roles' }] })
          .then(p => {
            let assignedRoleSlugs = p.roles.map(r => { return r.slug })

            return assert(assignedRoleSlugs.indexOf('admin') === -1, 'admin role was not revoked!')
          })
        })
      })
    })
  })
})
