module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn(
      'userTokens',
      'userId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    );
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn(
      'userTokens',
      'userId',
    );
  },
};
