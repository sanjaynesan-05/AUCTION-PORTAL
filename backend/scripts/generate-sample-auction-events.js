const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false,
});

// Define AuctionEvent model (same as in models/AuctionEvent.js)
const AuctionEvent = sequelize.define('AuctionEvent', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  eventType: {
    type: Sequelize.ENUM('bid', 'sold', 'unsold'),
    allowNull: false,
  },
  playerId: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  teamId: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  bidAmount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: true,
  },
  finalPrice: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: true,
  },
  timestamp: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
});

async function generateSampleAuctionEvents() {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Sync the model
    await AuctionEvent.sync();
    console.log('✅ AuctionEvent table synced');

    // Check if data already exists
    const existingCount = await AuctionEvent.count();
    if (existingCount > 0) {
      console.log(`ℹ️  Found ${existingCount} existing auction events. Skipping generation.`);
      return;
    }

    console.log('🎯 Generating sample auction events...');

    // Sample data for IPL auction simulation - using actual player and team UUIDs
    const sampleEvents = [
      // Player 1: Shivam Dube (All-rounder) - Sold to RCB
      { eventType: 'bid', playerId: '00940bc3-59b0-45c1-bcad-1e4d91f86972', teamId: '80d73b3b-e4a8-46f8-ab0f-2a96a57111c8', userId: 1, bidAmount: 15000000, timestamp: new Date('2024-01-15T10:00:00Z') },
      { eventType: 'bid', playerId: '00940bc3-59b0-45c1-bcad-1e4d91f86972', teamId: '0d63af3b-2cf4-48b1-9cda-823c30104122', userId: 2, bidAmount: 16000000, timestamp: new Date('2024-01-15T10:01:00Z') },
      { eventType: 'bid', playerId: '00940bc3-59b0-45c1-bcad-1e4d91f86972', teamId: '80d73b3b-e4a8-46f8-ab0f-2a96a57111c8', userId: 1, bidAmount: 17000000, timestamp: new Date('2024-01-15T10:02:00Z') },
      { eventType: 'sold', playerId: '00940bc3-59b0-45c1-bcad-1e4d91f86972', teamId: '80d73b3b-e4a8-46f8-ab0f-2a96a57111c8', userId: 1, finalPrice: 17000000, timestamp: new Date('2024-01-15T10:03:00Z') },

      // Player 2: Sherfane Rutherford (All-rounder) - Sold to MI
      { eventType: 'bid', playerId: '02cdc664-ec9c-44b9-8d19-3297d02367c3', teamId: '0d63af3b-2cf4-48b1-9cda-823c30104122', userId: 2, bidAmount: 12000000, timestamp: new Date('2024-01-15T10:15:00Z') },
      { eventType: 'bid', playerId: '02cdc664-ec9c-44b9-8d19-3297d02367c3', teamId: '7a7ef097-0eb9-412d-b722-9eeeb93e3486', userId: 3, bidAmount: 13000000, timestamp: new Date('2024-01-15T10:16:00Z') },
      { eventType: 'bid', playerId: '02cdc664-ec9c-44b9-8d19-3297d02367c3', teamId: '0d63af3b-2cf4-48b1-9cda-823c30104122', userId: 2, bidAmount: 14000000, timestamp: new Date('2024-01-15T10:17:00Z') },
      { eventType: 'sold', playerId: '02cdc664-ec9c-44b9-8d19-3297d02367c3', teamId: '0d63af3b-2cf4-48b1-9cda-823c30104122', userId: 2, finalPrice: 14000000, timestamp: new Date('2024-01-15T10:18:00Z') },

      // Player 3: Musheer Khan (Batsman) - Sold to MI
      { eventType: 'bid', playerId: '058bb4d4-de04-430f-a740-eb1510d9a4dc', teamId: '0d63af3b-2cf4-48b1-9cda-823c30104122', userId: 2, bidAmount: 16000000, timestamp: new Date('2024-01-15T10:30:00Z') },
      { eventType: 'bid', playerId: '058bb4d4-de04-430f-a740-eb1510d9a4dc', teamId: '61edc96c-0cd6-466b-b9de-19b4d4332b5d', userId: 4, bidAmount: 17000000, timestamp: new Date('2024-01-15T10:31:00Z') },
      { eventType: 'bid', playerId: '058bb4d4-de04-430f-a740-eb1510d9a4dc', teamId: '0d63af3b-2cf4-48b1-9cda-823c30104122', userId: 2, bidAmount: 18000000, timestamp: new Date('2024-01-15T10:32:00Z') },
      { eventType: 'sold', playerId: '058bb4d4-de04-430f-a740-eb1510d9a4dc', teamId: '0d63af3b-2cf4-48b1-9cda-823c30104122', userId: 2, finalPrice: 18000000, timestamp: new Date('2024-01-15T10:33:00Z') },

      // Player 4: Abdul Samad (All-rounder) - Sold to LSG
      { eventType: 'bid', playerId: '05ba29c4-4b50-4b3d-ab1c-727dfcfc0a57', teamId: '61edc96c-0cd6-466b-b9de-19b4d4332b5d', userId: 4, bidAmount: 14000000, timestamp: new Date('2024-01-15T10:45:00Z') },
      { eventType: 'bid', playerId: '05ba29c4-4b50-4b3d-ab1c-727dfcfc0a57', teamId: '7a7ef097-0eb9-412d-b722-9eeeb93e3486', userId: 3, bidAmount: 15000000, timestamp: new Date('2024-01-15T10:46:00Z') },
      { eventType: 'sold', playerId: '05ba29c4-4b50-4b3d-ab1c-727dfcfc0a57', teamId: '61edc96c-0cd6-466b-b9de-19b4d4332b5d', userId: 4, finalPrice: 15000000, timestamp: new Date('2024-01-15T10:47:00Z') },

      // Player 5: Anrich Nortje (Bowler) - Sold to DC
      { eventType: 'bid', playerId: '06ce6c9b-f1f2-456c-9c9a-9d94eddd8098', teamId: 'a5f6f468-c0cf-4a49-bf62-a7f8f8d4289b', userId: 5, bidAmount: 16000000, timestamp: new Date('2024-01-15T11:00:00Z') },
      { eventType: 'bid', playerId: '06ce6c9b-f1f2-456c-9c9a-9d94eddd8098', teamId: 'e42511fc-e7ab-42ac-bbfe-6444ad0a2308', userId: 6, bidAmount: 17000000, timestamp: new Date('2024-01-15T11:01:00Z') },
      { eventType: 'bid', playerId: '06ce6c9b-f1f2-456c-9c9a-9d94eddd8098', teamId: 'a5f6f468-c0cf-4a49-bf62-a7f8f8d4289b', userId: 5, bidAmount: 18000000, timestamp: new Date('2024-01-15T11:02:00Z') },
      { eventType: 'sold', playerId: '06ce6c9b-f1f2-456c-9c9a-9d94eddd8098', teamId: 'a5f6f468-c0cf-4a49-bf62-a7f8f8d4289b', userId: 5, finalPrice: 18000000, timestamp: new Date('2024-01-15T11:03:00Z') },

      // Player 6: Mohammad Nabi (All-rounder) - Sold to GT
      { eventType: 'bid', playerId: '0709fbc8-26fc-436b-8434-e202c5bddeab', teamId: '0e8542a9-c54b-4cf0-87c4-0c4252ea9dc9', userId: 7, bidAmount: 11000000, timestamp: new Date('2024-01-15T11:15:00Z') },
      { eventType: 'bid', playerId: '0709fbc8-26fc-436b-8434-e202c5bddeab', teamId: '80d73b3b-e4a8-46f8-ab0f-2a96a57111c8', userId: 1, bidAmount: 12000000, timestamp: new Date('2024-01-15T11:16:00Z') },
      { eventType: 'sold', playerId: '0709fbc8-26fc-436b-8434-e202c5bddeab', teamId: '0e8542a9-c54b-4cf0-87c4-0c4252ea9dc9', userId: 7, finalPrice: 12000000, timestamp: new Date('2024-01-15T11:17:00Z') },

      // Player 7: Riyan Parag (All-rounder) - Sold to KKR
      { eventType: 'bid', playerId: '071da8a8-42a7-4e9b-bb5b-2d537c7f62aa', teamId: 'e42511fc-e7ab-42ac-bbfe-6444ad0a2308', userId: 6, bidAmount: 10000000, timestamp: new Date('2024-01-15T11:30:00Z') },
      { eventType: 'bid', playerId: '071da8a8-42a7-4e9b-bb5b-2d537c7f62aa', teamId: 'c82af476-ac67-4220-a082-e7ca82efca68', userId: 8, bidAmount: 11000000, timestamp: new Date('2024-01-15T11:31:00Z') },
      { eventType: 'sold', playerId: '071da8a8-42a7-4e9b-bb5b-2d537c7f62aa', teamId: 'e42511fc-e7ab-42ac-bbfe-6444ad0a2308', userId: 6, finalPrice: 11000000, timestamp: new Date('2024-01-15T11:32:00Z') },

      // Player 8: Manimaran Siddharth (Bowler) - Sold to RR
      { eventType: 'bid', playerId: '074c8f52-0567-404e-ac0b-b84c5af0d618', teamId: 'fb15d46e-1b55-4ae3-99fe-49db3ee96eee', userId: 9, bidAmount: 18000000, timestamp: new Date('2024-01-15T11:45:00Z') },
      { eventType: 'bid', playerId: '074c8f52-0567-404e-ac0b-b84c5af0d618', teamId: 'b0f0560e-875b-4200-9e90-97ec92568f5f', userId: 10, bidAmount: 19000000, timestamp: new Date('2024-01-15T11:46:00Z') },
      { eventType: 'sold', playerId: '074c8f52-0567-404e-ac0b-b84c5af0d618', teamId: 'fb15d46e-1b55-4ae3-99fe-49db3ee96eee', userId: 9, finalPrice: 19000000, timestamp: new Date('2024-01-15T11:47:00Z') },

      // Player 9: Swapnil Singh (Bowler) - Sold to SRH
      { eventType: 'bid', playerId: '08ccab05-8361-4951-b80a-c047eff2a3e7', teamId: 'c82af476-ac67-4220-a082-e7ca82efca68', userId: 8, bidAmount: 24600000, timestamp: new Date('2024-01-15T12:00:00Z') },
      { eventType: 'bid', playerId: '08ccab05-8361-4951-b80a-c047eff2a3e7', teamId: 'e42511fc-e7ab-42ac-bbfe-6444ad0a2308', userId: 6, bidAmount: 24700000, timestamp: new Date('2024-01-15T12:01:00Z') },
      { eventType: 'sold', playerId: '08ccab05-8361-4951-b80a-c047eff2a3e7', teamId: 'c82af476-ac67-4220-a082-e7ca82efca68', userId: 8, finalPrice: 24700000, timestamp: new Date('2024-01-15T12:02:00Z') },

      // Player 10: Keshav Maharaj (Bowler) - Sold to CSK
      { eventType: 'bid', playerId: '094ff48e-eefd-4bf1-adfe-6fcec67a959f', teamId: 'b0f0560e-875b-4200-9e90-97ec92568f5f', userId: 10, bidAmount: 20500000, timestamp: new Date('2024-01-15T12:15:00Z') },
      { eventType: 'bid', playerId: '094ff48e-eefd-4bf1-adfe-6fcec67a959f', teamId: 'c82af476-ac67-4220-a082-e7ca82efca68', userId: 8, bidAmount: 21000000, timestamp: new Date('2024-01-15T12:16:00Z') },
      { eventType: 'sold', playerId: '094ff48e-eefd-4bf1-adfe-6fcec67a959f', teamId: 'b0f0560e-875b-4200-9e90-97ec92568f5f', userId: 10, finalPrice: 21000000, timestamp: new Date('2024-01-15T12:17:00Z') },

      // Some players remain unsold
      { eventType: 'unsold', playerId: '09628a7a-8efa-4ecd-a9d9-e1a5b4b02b9f', timestamp: new Date('2024-01-15T12:30:00Z') },
      { eventType: 'unsold', playerId: '0a044ae6-0827-4ad2-a8b6-8d932c1f55dd', timestamp: new Date('2024-01-15T12:45:00Z') },
      { eventType: 'unsold', playerId: '0a66cb79-7a3a-46ac-b356-29da8144451d', timestamp: new Date('2024-01-15T13:00:00Z') },
    ];

    // Insert sample events
    await AuctionEvent.bulkCreate(sampleEvents);
    console.log(`✅ Generated ${sampleEvents.length} sample auction events`);

    // Calculate and display summary
    const totalEvents = await AuctionEvent.count();
    const soldEvents = await AuctionEvent.count({ where: { eventType: 'sold' } });
    const totalRevenue = await AuctionEvent.sum('finalPrice', { where: { eventType: 'sold' } });

    console.log('\n📊 Analytics Summary:');
    console.log(`Total Events: ${totalEvents}`);
    console.log(`Players Sold: ${soldEvents}`);
    console.log(`Total Revenue: ₹${totalRevenue?.toLocaleString() || 0}`);

  } catch (error) {
    console.error('❌ Error generating sample auction events:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the script
generateSampleAuctionEvents();