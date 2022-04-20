const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class productType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      productType.belongsToMany(models.brand, { through: 'typeBrands', foreignKey: 'id' });
      productType.belongsTo(models.device);
    }
  }
  productType.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'productType',
  });
  return productType;
};
