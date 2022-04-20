const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class deviceInfo extends Model {
    static associate(models) {
      deviceInfo.belongsTo(models.device);
    }
  }
  deviceInfo.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'deviceInfo',
  });
  return deviceInfo;
};
