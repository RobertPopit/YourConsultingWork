'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('Persons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nume: {
        type: Sequelize.STRING,
        allowNull: false 
    },
    prenume: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cnp: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true 
    },
    varsta: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('Persons');
  }
};
