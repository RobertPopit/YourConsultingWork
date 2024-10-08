'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('Junction', {
          personId: {
              type: Sequelize.INTEGER,
              references: {
                  model: 'Persons',
                  key: 'id',
                  onDelete: 'CASCADE',
                  onUpdate: 'CASCADE'
              },
              primaryKey: true
          },
          carId: {
              type: Sequelize.INTEGER,
              references: {
                  model: 'Cars',
                  key: 'id',
                  onDelete: 'CASCADE',
                  onUpdate: 'CASCADE'
              },
              primaryKey: true
          },
          createdAt: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.NOW
          },
          updatedAt: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.NOW
          }
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('Junction');
  }
};
