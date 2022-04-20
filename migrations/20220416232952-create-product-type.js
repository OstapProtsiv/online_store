module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('productTypes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
      },

    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('productTypes');
  },
};
