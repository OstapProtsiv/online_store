module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('devices', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      rating: {
        type: Sequelize.INTEGER,
      },
      img: {
        type: Sequelize.STRING,
      },
      // brandId: {
      //   type: Sequelize.INTEGER
      // },
      // typeId: {
      //   type: Sequelize.INTEGER
      // },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('devices');
  },
};
