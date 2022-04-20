module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('baskets', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,

      },
      // userId: {
      //   type: Sequelize.INTEGER
      // }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('baskets');
  },
};
