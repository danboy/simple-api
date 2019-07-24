"use strict";
module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define(
    "File",
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
      actor_type: DataTypes.STRING(50),
      description: DataTypes.STRING(1023),
      actor_id: DataTypes.UUID,
      details: DataTypes.JSON
    },
    { tableName: "products" }
  );

  File.associate = function(models) {
    models.File.belongsToMany(models.Product, {
      as: "assets",
      through: "file_assignments",
      scope: {
        actor_id: "file_id"
      },
      foreignKey: "actor_id"
    });
  };

  return File;
};
