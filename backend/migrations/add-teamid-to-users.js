/**
 * Migration Script: Add teamId to Users Table
 * Adds team assignment capability for viewer accounts
 */

const { sequelize } = require('../database');
const { DataTypes } = require('sequelize');
require('dotenv').config();

const addTeamIdColumn = async () => {
  try {
    console.log('🔄 Starting migration: Add teamId to users table...\n');

    // Check database connection
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Check if column already exists
    const tableInfo = await sequelize.getQueryInterface().describeTable('users');
    
    if (tableInfo.teamId) {
      console.log('ℹ️  teamId column already exists in users table');
      console.log('   No migration needed.\n');
      process.exit(0);
    }

    console.log('📝 Adding teamId column to users table...');

    // Add the column
    await sequelize.getQueryInterface().addColumn('users', 'teamId', {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
      references: {
        model: 'teams',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    console.log('✅ teamId column added successfully\n');

    // Verify the column was added
    const updatedTableInfo = await sequelize.getQueryInterface().describeTable('users');
    if (updatedTableInfo.teamId) {
      console.log('✅ Migration verified - column exists\n');
      
      console.log('📋 Next steps:');
      console.log('   1. Assign teams to viewer accounts');
      console.log('   2. Use: UPDATE users SET teamId = \'<team-uuid>\' WHERE username = \'viewer-name\'');
      console.log('   3. Or create a script to auto-assign teams\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('\nError details:', error.message);
    process.exit(1);
  }
};

// Run migration
addTeamIdColumn();
