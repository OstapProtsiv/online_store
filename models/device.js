const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class device extends Model {
    static associate(models) {
      device.hasOne(models.device);
      device.hasOne(models.productType);
      device.hasMany(models.deviceInfo);
    }
  }
  device.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    price: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
    img: DataTypes.STRING,
    brandId: DataTypes.INTEGER,
    typeId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'device',
  });
  return device;
};
