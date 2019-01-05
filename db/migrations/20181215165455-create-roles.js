'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(50),
        unique: true,
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING(20),
        unique: true,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING(1023)
      },
      actor_id: {
        type: Sequelize.UUID
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defautValue: Sequelize.NOW
      }
    }, {
      indexes: [
        { fields: ['slug'], unique: true }
      ]
    })
    .then(() => {
      return queryInterface.bulkInsert('roles', [
        { name: 'Administrator', slug: 'admin', description: 'Ability to perform any action the system exposes over the API.', created_at: new Date(), updated_at: new Date() }
      ])
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('roles')
  }
}
