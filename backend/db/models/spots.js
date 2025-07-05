"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
   
    static associate(models) {
      // Define association here
      Spot.belongsTo(models.User, { foreignKey: "ownerId", as: "Owner" });
      Spot.hasMany(models.SpotImage, { foreignKey: "spotId", as: "SpotImages" });
      Spot.hasMany(models.Review, { foreignKey: "spotId", as: "Reviews" });
    }
  }
  Spot.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      country: DataTypes.STRING,
      lat: {
        type: DataTypes.FLOAT,
        allowNull: true, // ✅ Now optional
        validate: {
          min: -90,
          max: 90,
        },
      },
      lng: {
        type: DataTypes.FLOAT,
        allowNull: true, // ✅ Now optional
        validate: {
          min: -180,
          max: 180,
        },
      },
      description: DataTypes.STRING,
      price: DataTypes.DECIMAL,
      avgRating: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
      },
      previewImage: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Spot",
      tableName: "Spots",
    }
  );

  return Spot;
};
