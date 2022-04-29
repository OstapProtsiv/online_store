const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class brand extends Model {
    static associate(models) {
      brand.belongsToMany(
        models.productType,
        { through: 'typeBrands', foreignKey: 'id' },
      );
      brand.hasOne(models.device);
    }
  }
  brand.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'brand',
  });
  return brand;
};
