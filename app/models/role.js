"use strict";
module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(
    "Role",
    {
      name: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING(50)
      },
      slug: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING(20)
      },
      actor_id: DataTypes.UUID,
      description: DataTypes.STRING(1023)
    },
    { tableName: "roles" }
  );

  model.associate = function(models) {
    models.Role.belongsToMany(models.User, {
      as: "users",
      through: "role_assignments",
      foreignKey: "role_id",
      otherKey: "user_id"
    });

    models.Role.belongsTo(models.User, {
      as: "actor",
      foreignKey: "actor_id"
    });
  };

  model.prototype.isAdmin = function() {
    return this.slug === "admin";
  };

  return model;
};
