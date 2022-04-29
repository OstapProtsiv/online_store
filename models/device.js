const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class device extends Model {
    static associate(models) {
      device.hasMany(models.deviceInfo);
      device.hasMany(models.basket);
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
