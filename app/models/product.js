"use strict";
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
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
      description: DataTypes.STRING(1023),
      user_id: DataTypes.UUID,
      details: DataTypes.JSON
    },
    { tableName: "products" }
  );

  model.associate = function(models) {
    models.Product.belongsToMany(models.File, {
      as: "assets",
      scope: {
        actor_id: "file"
      },
      foreignKey: "actor_id"
    });
  };

  model.prototype.isAdmin = function() {
    return this.slug === "admin";
  };

  return Product;
};
