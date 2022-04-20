module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'baskets',
        'userId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'baskets',
        'deviceId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'devices',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        { transaction },
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn(
        'baskets',
        'userId',
        { transaction },
      );
      await queryInterface.removeColumn(
        'baskets',
        'deviceId',
        { transaction },
      );
    });
  },
};
