const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class basket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      basket.belongsTo(models.user);
      basket.hasMany(models.device);
    }
  }
  basket.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'basket',
  });
  return basket;
};
