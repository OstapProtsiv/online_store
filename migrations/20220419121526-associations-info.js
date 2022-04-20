module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn(
      'deviceInfos',
      'deviceId',
      {
        references: {
          model: 'devices',
          key: 'id',
        },
        type: Sequelize.INTEGER,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn(
      'deviceInfos',
      'deviceId',
    );
  },
};
