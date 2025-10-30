const { sequelize } = require('../database');
const { AuctionEvent } = require('../models');

async function clearAuctionEvents() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    await AuctionEvent.destroy({ where: {} });
    console.log('✅ Cleared all auction events');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

clearAuctionEvents();