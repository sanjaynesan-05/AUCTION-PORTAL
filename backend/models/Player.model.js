const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

/**
 * Player Model for cricket players in the auction
 */
const Player = sequelize.define(
  'Player',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Player name is required',
        },
      },
    },
    role: {
      type: DataTypes.ENUM('Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper'),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Player role is required',
        },
        isIn: {
          args: [['Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper']],
          msg: 'Invalid player role',
        },
      },
    },
    basePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Base price cannot be negative',
        },
      },
    },
    sold: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    teamId: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
      references: {
        model: 'teams',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: null,
      validate: {
        min: {
          args: [0],
          msg: 'Price cannot be negative',
        },
      },
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Nationality is required',
        },
      },
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [16],
          msg: 'Age must be at least 16',
        },
        max: {
          args: [50],
          msg: 'Age must be less than 50',
        },
      },
    },
    battingStyle: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    bowlingStyle: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
    // Stats as JSONB for flexible structure
    stats: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        matches: 0,
        runs: 0,
        wickets: 0,
        average: 0,
        strikeRate: 0,
      },
    },
  },
  {
    tableName: 'players',
    timestamps: true,
    indexes: [
      {
        fields: ['sold'],
      },
      {
        fields: ['role'],
      },
      {
        fields: ['teamId'],
      },
      {
        fields: ['name'],
      },
    ],
  }
);

/**
 * Instance method to get avatar URL
 */
Player.prototype.getAvatarUrl = function () {
  if (this.image) {
    return this.image;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=6366f1&color=fff&size=128`;
};

/**
 * Override toJSON to include virtual avatarUrl
 */
Player.prototype.toJSON = function () {
  const values = { ...this.get() };
  values.avatarUrl = this.getAvatarUrl();
  return values;
};

module.exports = Player;
