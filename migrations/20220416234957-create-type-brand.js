module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('typeBrands', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('typeBrands');
  },
};
