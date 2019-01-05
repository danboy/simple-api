'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4(),
        allowNull: false,
        primaryKey: true
      },
      full_name: { // "What is your full name?" - Jos van der Wallen
        type: Sequelize.STRING(100),
        allowNull: true
      },
      common_name: { // "What shoudl we call you?" - Jos, etc
        type: Sequelize.STRING(20),
        allowNull: true
      },
      email: {
        type: Sequelize.STRING(120),
        isEmail: true,
        unique: true
      },
      phone: {
        type: Sequelize.STRING(30),
        not: ['[a-z]', 'i'],
        unique: true,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      password: Sequelize.STRING,
      slug: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true
      },
      updated_at: Sequelize.DATE,
      created_at: Sequelize.DATE
    })
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('users')
  }
}
