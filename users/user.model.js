const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    first_name: { type: DataTypes.STRING, allowNull: false},
    last_name: { type: DataTypes.STRING, allowNull: false},
    email: { type: DataTypes.STRING, allowNull: false },
    contact_details: { type: DataTypes.STRING, allowNull: true },
    country_code: { type: DataTypes.STRING, allowNull: true },
  };
  
  return sequelize.define("User", attributes);
}