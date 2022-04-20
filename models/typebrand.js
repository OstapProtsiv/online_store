const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class typeBrand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {

    }
  }
  typeBrand.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

  }, {
    sequelize,
    modelName: 'typeBrand',
  });
  return typeBrand;
};
