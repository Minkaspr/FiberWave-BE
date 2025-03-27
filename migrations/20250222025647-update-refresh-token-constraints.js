'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn('refresh_token', 'user_id', {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.changeColumn('refresh_token', 'user_id', {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  });
}

// module.exports = {
//   async up (queryInterface, Sequelize) {
//     /**
//      * Add altering commands here.
//      *
//      * Example:
//      * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
//      */

//     await queryInterface.changeColumn('refresh_token', 'user_id', {
//       type: Sequelize.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'user', // Nombre de la tabla de usuarios
//         key: 'id',
//       },
//       onUpdate: 'CASCADE',
//       onDelete: 'CASCADE', // Cambia de RESTRICT a CASCADE
//     });
//   },

//   async down (queryInterface, Sequelize) {
//     /**
//      * Add reverting commands here.
//      *
//      * Example:
//      * await queryInterface.dropTable('users');
//      */
//     await queryInterface.changeColumn('refresh_token', 'user_id', {
//       type: Sequelize.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'user',
//         key: 'id',
//       },
//       onUpdate: 'CASCADE',
//       onDelete: 'RESTRICT', // Volvemos a RESTRICT si se revierte
//     });
//   }
// };
