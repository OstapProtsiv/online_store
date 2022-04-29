module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'devices',
        'typeId',
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
      await queryInterface.addColumn(
        'devices',
        'brandId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'brands',
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
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('devices', 'typeId', { transaction });
      await queryInterface.removeColumn(
        'devices',
        'brandId',
        { transaction },
      );
    });
  },
};
