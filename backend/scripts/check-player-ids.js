const { sequelize } = require('../database');

async function checkPlayerIds() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    // Get all player IDs with roles
    const [players] = await sequelize.query("SELECT id, name, role FROM players ORDER BY id LIMIT 15");
    console.log('First 15 players with roles:', players.map(p => ({ id: p.id, name: p.name, role: p.role })));

    // Get team IDs
    const [teams] = await sequelize.query("SELECT id, name FROM teams ORDER BY id");
    console.log('Teams:', teams);

    // Check auction events
    const [auctionEvents] = await sequelize.query("SELECT playerId, eventType FROM AuctionEvents LIMIT 20");
    console.log('Auction events:', auctionEvents);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkPlayerIds();