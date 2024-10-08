'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('Cars', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
     
      denumire_marca: {
        type: Sequelize.STRING,
        allowNull: false
      },
      denumire_model: {
        type: Sequelize.STRING,
        allowNull: false
      },
      anul_fabricatiei: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      capacitatea_cilindrica: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      taxa_impozit: {
        type: Sequelize.FLOAT,
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Cars');
  }
};
