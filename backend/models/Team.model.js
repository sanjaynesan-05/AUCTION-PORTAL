const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

/**
 * Team Model for IPL teams in the auction
 */
const Team = sequelize.define(
  'Team',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Team name already exists',
      },
      validate: {
        notEmpty: {
          msg: 'Team name is required',
        },
      },
    },
    shortName: {
      type: DataTypes.STRING(5),
      allowNull: false,
      unique: {
        msg: 'Short name already exists',
      },
      validate: {
        notEmpty: {
          msg: 'Short name is required',
        },
        len: {
          args: [2, 5],
          msg: 'Short name must be between 2 and 5 characters',
        },
      },
    },
    purse: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 12000,
      validate: {
        min: {
          args: [0],
          msg: 'Purse cannot be negative',
        },
      },
    },
    logo: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
    color: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: '#000000',
      validate: {
        is: {
          args: /^#[0-9A-F]{6}$/i,
          msg: 'Color must be a valid hex color code',
        },
      },
    },
  },
  {
    tableName: 'teams',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['name'],
      },
      {
        unique: true,
        fields: ['shortName'],
      },
    ],
  }
);

/**
 * Instance method to calculate total spent
 */
Team.prototype.getTotalSpent = function () {
  return parseFloat(12000 - this.purse);
};

/**
 * Instance method to get remaining purse
 */
Team.prototype.getRemainingPurse = function () {
  return parseFloat(this.purse);
};

/**
 * Instance method to add player to team
 * @param {string} playerId - Player UUID
 * @param {number} price - Player price
 * @returns {boolean}
 */
Team.prototype.addPlayerToTeam = async function (playerId, price) {
  const Player = require('./Player.model');
  
  if (this.purse >= price) {
    this.purse = parseFloat(this.purse) - parseFloat(price);
    await this.save();
    
    // Update player
    await Player.update(
      {
        sold: true,
        teamId: this.id,
        price: price,
      },
      {
        where: { id: playerId },
      }
    );
    
    return true;
  }
  return false;
};

/**
 * Instance method to remove player from team
 * @param {string} playerId - Player UUID
 * @param {number} price - Player price to refund
 * @returns {boolean}
 */
Team.prototype.removePlayerFromTeam = async function (playerId, price) {
  const Player = require('./Player.model');
  
  const player = await Player.findOne({
    where: { id: playerId, teamId: this.id },
  });
  
  if (player) {
    this.purse = parseFloat(this.purse) + parseFloat(price);
    await this.save();
    
    // Update player
    await Player.update(
      {
        sold: false,
        teamId: null,
        price: null,
      },
      {
        where: { id: playerId },
      }
    );
    
    return true;
  }
  return false;
};

/**
 * Override toJSON to include virtual fields
 */
Team.prototype.toJSON = function () {
  const values = { ...this.get() };
  values.totalSpent = this.getTotalSpent();
  values.remainingPurse = this.getRemainingPurse();
  return values;
};

module.exports = Team;
