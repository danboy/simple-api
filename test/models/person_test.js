const Promise = require("bluebird");
const assert = require("assert");
const { User } = require("../../app/models");
const {
  generateActivityMeta,
  generateAddressMeta,
  generateUserMeta
} = require("../helpers");

describe("User", function() {
  const Options = {};

  after(() => {
    User.destroy({ truncate: true });
  });

  describe("createUser()", function() {
    it("it fails to create a user without an username", function() {
      let badUser = generateUserMeta();
      badUser.username = null;

      return User.create(badUser, Options).catch(error => {
        return assert.notStrictEqual(error, undefined);
      });
    });

    it("it creates a user ", function() {
      return User.create(generateUserMeta(), Options).then(user => {
        return assert(user.email);
      });
    });

    it("it encrypts the password in user_data", function() {
      let user = generateUserMeta();
      return User.create(generateUserMeta(), Options).then(u => {
        return assert.notStrictEqual(u.password, user.password);
      });
    });

    xit("it encrypts the password in user_data", function() {});
  });
});
