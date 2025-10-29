const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

/**
 * Initialize Sequelize with SQLite
 * SQLite is a file-based database - no server installation needed!
 */
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'), // Database file location
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  
  // SQLite-specific options
  define: {
    freezeTableName: false,
    timestamps: true,
  },
});

/**
 * Test database connection
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite Database Connected!');
    console.log(`📊 Database file: ${sequelize.options.storage}`);

    // Sync models with database (creates tables if they don't exist)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false }); // Use alter: true to auto-update tables
      console.log('📋 Database tables synchronized');
    }
  } catch (error) {
    console.error('❌ SQLite Connection Error:', error.message);
    process.exit(1);
  }
};

// Handle connection events
sequelize.beforeConnect(() => {
  console.log('🔄 Connecting to SQLite database...');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await sequelize.close();
    console.log('SQLite connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('Error closing SQLite connection:', error);
    process.exit(1);
  }
});

module.exports = { sequelize, connectDB };
