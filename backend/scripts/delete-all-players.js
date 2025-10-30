const { sequelize, Player } = require('../models');
require('dotenv').config();

/**
 * Delete all players from the database
 */
const deleteAllPlayers = async () => {
  try {
    console.log('🔄 Deleting all players from database...\n');

    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established\n');

    // Get current player count
    const playerCount = await Player.count();
    console.log(`📊 Current players in database: ${playerCount}\n`);

    if (playerCount === 0) {
      console.log('ℹ️  No players to delete. Database is already empty.\n');
      process.exit(0);
    }

    // Confirm deletion (in production you'd want user confirmation)
    console.log('⚠️  WARNING: This will delete ALL players from the database!');
    console.log('   This action cannot be undone.\n');

    // Delete all players
    console.log('🗑️  Deleting all players...');
    const deletedCount = await Player.destroy({
      where: {}, // Empty where clause deletes all records
      truncate: true, // This is more efficient for deleting all records
    });

    console.log(`✅ Successfully deleted ${deletedCount} players\n`);

    // Verify deletion
    const remainingCount = await Player.count();
    console.log(`📊 Players remaining in database: ${remainingCount}\n`);

    if (remainingCount === 0) {
      console.log('🎉 All players have been successfully deleted!\n');
    } else {
      console.log('⚠️  Warning: Some players may still remain in the database.\n');
    }

    process.exit(0);

  } catch (error) {
    console.error('❌ Failed to delete players:', error.message);
    process.exit(1);
  }
};

// Run the deletion
deleteAllPlayers();
