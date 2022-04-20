const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class userToken extends Model {
    static associate(models) {
      userToken.hasOne(models.user);
    }
  }
  userToken.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    refreshToken: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'userToken',
  });
  return userToken;
};
