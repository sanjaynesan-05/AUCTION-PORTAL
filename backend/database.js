const { Sequelize } = require('sequelize');
require('dotenv').config();

/**
 * Initialize Sequelize with PostgreSQL connection
 */
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    // Enable SSL for production (e.g., Heroku, AWS RDS)
    ...(process.env.NODE_ENV === 'production' && {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }),
  },
});

/**
 * Test database connection
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Connected successfully');
    console.log(`📊 Database: ${sequelize.config.database}`);
    console.log(`🏠 Host: ${sequelize.config.host}:${sequelize.config.port}`);

    // Sync models with database (creates tables if they don't exist)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false }); // Use alter: true to auto-update tables
      console.log('📋 Database tables synchronized');
    }
  } catch (error) {
    console.error('❌ PostgreSQL Connection Error:', error.message);
    console.error('💡 Make sure PostgreSQL is running and credentials are correct');
    process.exit(1);
  }
};

// Handle connection events
sequelize.beforeConnect(() => {
  console.log('🔄 Connecting to PostgreSQL...');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await sequelize.close();
    console.log('PostgreSQL connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('Error closing PostgreSQL connection:', error);
    process.exit(1);
  }
});

module.exports = { sequelize, connectDB };
