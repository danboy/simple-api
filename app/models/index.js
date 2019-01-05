const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(module.filename);
const config = require("../../db/config");
const env = process.env.NODE_ENV || "development";
const db = {};
const sequelize = new Sequelize(config[env]);

fs.readdirSync(__dirname)
  .filter(
    file =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

// associate
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }

  if (db[modelName].loadScopes) {
    db[modelName].loadScopes(db, sequelize.Op);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
