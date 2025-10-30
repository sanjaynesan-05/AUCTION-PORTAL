const { sequelize } = require('../database');

async function checkTables() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    const [results] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('Tables:', results.map(r => r.name));

    // Check auction_events table
    const [auctionEvents] = await sequelize.query("SELECT COUNT(*) as count FROM auction_events");
    console.log('auction_events count:', auctionEvents[0].count);

    // Check AuctionEvents table
    try {
      const [auctionEventsPlural] = await sequelize.query("SELECT COUNT(*) as count FROM AuctionEvents");
      console.log('AuctionEvents table count:', auctionEventsPlural[0].count);
    } catch (error) {
      console.log('AuctionEvents table does not exist');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkTables();