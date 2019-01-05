"use strict";

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(
    "RoleAssignment",
    {
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      actor_id: {
        type: DataTypes.UUID,
        allowNull: false
      }
    },
    { tableName: "role_assignments" }
  );

  model.associate = function(models) {
    model.belongsTo(models.User, {
      as: "actor",
      foreignKey: "actor_id",
      constraints: false
    });

    model.belongsTo(models.User, {
      as: "user",
      foreignKey: "user_id",
      constraints: false
    });
  };
  return model;
};
