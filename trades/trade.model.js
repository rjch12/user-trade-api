const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    
    const tradeAttributes = {
        id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
        ticker: { type: DataTypes.STRING, allowNull: false },
        order: { type: DataTypes.INTEGER, allowNull: false },
        price: { type: DataTypes.INTEGER, allowNull: false },
        execution_type: { type: DataTypes.INTEGER, allowNull: false },
        execution_date: { type: DataTypes.INTEGER, allowNull: false },
        user_id: { type: DataTypes.STRING, allowNull: false }
    };

    return sequelize.define('Trades', tradeAttributes);
}
