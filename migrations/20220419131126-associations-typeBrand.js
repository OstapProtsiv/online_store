module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'typeBrands',
        'typeId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'productTypes',
            key: 'id',
          },
        },
        { transaction },
      );
      await queryInterface.addColumn(
        'typeBrands',
        'brandId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'brands',
            key: 'id',
          },
        },
        { transaction },
      );
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('typeBrands', 'typeId', { transaction });
      await queryInterface.removeColumn(
        'typeBrands',
        'brandId',
        { transaction },
      );
    });
  },
};
