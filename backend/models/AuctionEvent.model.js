const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const AuctionEvent = sequelize.define('AuctionEvent', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  eventType: {
    type: DataTypes.ENUM('bid', 'sold', 'unsold'),
    allowNull: false,
  },
  playerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  teamId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  bidAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  finalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'AuctionEvents',
  timestamps: true,
});

module.exports = AuctionEvent;