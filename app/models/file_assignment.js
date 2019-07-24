"use strict";

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(
    "FileAssignment",
    {
      file_id: {
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
    { tableName: "file_assignments" }
  );
  return model;
};
