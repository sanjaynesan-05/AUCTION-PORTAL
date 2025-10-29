const { sequelize } = require('../database');
const User = require('./User.model');
const Player = require('./Player.model');
const Team = require('./Team.model');

/**
 * Define model associations
 */

// Team has many Players
Team.hasMany(Player, {
  foreignKey: 'teamId',
  as: 'players',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

// Player belongs to Team
Player.belongsTo(Team, {
  foreignKey: 'teamId',
  as: 'team',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

/**
 * Sync all models with database
 * @param {boolean} force - Drop tables before creating (use with caution)
 * @param {boolean} alter - Alter tables to fit models (development only)
 * @returns {Promise<void>}
 */
const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('✅ Database models synchronized');
  } catch (error) {
    console.error('❌ Database sync failed:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  Player,
  Team,
  syncDatabase,
};
