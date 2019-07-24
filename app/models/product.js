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

  Product.associate = function(models) {
    models.Product.belongsToMany(models.File, {
      as: "assets",
      through: "file_assignments",
      scope: {
        actor_id: "file"
      },
      foreignKey: "actor_id"
    });
  };

  Product.prototype.isAdmin = function() {
    return this.slug === "admin";
  };

  return Product;
};
