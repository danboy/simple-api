const alphaNumeric = require("faker").random.alphaNumeric;
const crypto = require("bcrypt");
const userStates = {
  ACTIVE: "active",
  CREATED: "created"
};

const User = (sequelize, DataTypes) => {
  const model = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4(),
        primaryKey: true,
        allowNull: false
      },
      full_name: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      common_name: {
        type: DataTypes.STRING(20)
      },
      email: {
        type: DataTypes.STRING(120),
        isEmail: true,
        unique: true
      },
      phone: {
        type: DataTypes.STRING(30),
        not: ["[a-z]", "i"],
        unique: true,
        allowNull: true
      },
      password: DataTypes.STRING,
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: userStates.CREATED
      },
      slug: {
        type: DataTypes.STRING(30),
        allowNull: true,
        unique: true
      }
    },
    {
      tableName: "users"
    }
  );

  model.beforeValidate((media, options) => {
    media.slug = alphaNumeric(10);

    return media;
  });

  model.associate = function(models) {
    model.belongsToMany(models.Role, {
      as: "roles",
      through: {
        model: models.RoleAssignment,
        attributes: []
      },
      foreignKey: "user_id",
      constraints: false
    });
  };

  model.prototype.authenticate = function(candidatePassword, cb) {
    crypto.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      return cb(null, isMatch);
    });
  };

  model.activateWithPhone = function(phoneNumber) {
    return model.update(
      {
        status: userStates.ACTIVE
      },
      { where: { phone: phoneNumber } }
    );
  };

  // TODO: This is not correct anymore. We need some unit tests around
  // this and the idea of "user states".
  model.beforeSave((user, options) => {
    const salt = crypto.genSaltSync(10);
    user.password = crypto.hashSync(user.password, salt);
  });

  return model;
};

module.exports = User;
