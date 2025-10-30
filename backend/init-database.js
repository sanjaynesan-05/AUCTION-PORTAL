const { sequelize, User, Player, Team, syncDatabase } = require('./models');
require('dotenv').config();

/**
 * Initialize PostgreSQL database with tables and optional seed data
 */
const initDatabase = async () => {
  try {
    console.log('🔄 Starting database initialization...\n');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection established\n');

    // Sync database (create tables)
    console.log('📋 Creating database tables...');
    await syncDatabase({ force: false, alter: true });
    console.log('✅ Tables created successfully\n');

    // Check if admin user exists
    const adminExists = await User.findOne({ where: { username: 'admin' } });
    
    if (!adminExists) {
      console.log('👤 Creating default admin user...');
      await User.create({
        username: 'admin',
        password: 'admin123',
        role: 'admin',
      });
      console.log('✅ Admin user created (username: admin, password: admin123)\n');
    } else {
      console.log('ℹ️  Admin user already exists\n');
    }

    // Check if presenter user exists
    const presenterExists = await User.findOne({ where: { username: 'presenter' } });
    
    if (!presenterExists) {
      console.log('👤 Creating default presenter user...');
      await User.create({
        username: 'presenter',
        password: 'presenter123',
        role: 'presenter',
      });
      console.log('✅ Presenter user created (username: presenter, password: presenter123)\n');
    } else {
      console.log('ℹ️  Presenter user already exists\n');
    }

    // Check if viewer user exists
    const viewerExists = await User.findOne({ where: { username: 'viewer' } });
    
    if (!viewerExists) {
      console.log('👤 Creating default viewer user...');
      await User.create({
        username: 'viewer',
        password: 'viewer123',
        role: 'viewer',
      });
      console.log('✅ Viewer user created (username: viewer, password: viewer123)\n');
    } else {
      console.log('ℹ️  Viewer user already exists\n');
    }

    // Check if seed data needed
    const playerCount = await Player.count();
    const teamCount = await Team.count();

    console.log(`📊 Current database status:`);
    console.log(`   - Players: ${playerCount}`);
    console.log(`   - Teams: ${teamCount}`);
    console.log(`   - Users: ${await User.count()}\n`);

    if (teamCount === 0) {
      console.log('🏆 Creating sample IPL teams...');
      await createSampleTeams();
      console.log('✅ Sample teams created\n');
    }

    if (playerCount === 0) {
      console.log('👥 Creating sample players...');
      await createSamplePlayers();
      console.log('✅ Sample players created\n');
    }

    console.log('✅ Database initialization complete!\n');
    console.log('Next steps:');
    console.log('1. Start the server: npm start');
    console.log('2. Login with admin credentials (admin/admin123)');
    console.log('3. Access API at http://localhost:5000\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

/**
 * Create sample IPL teams
 */
const createSampleTeams = async () => {
  const teams = [
    { 
      name: 'Chennai Super Kings', 
      shortName: 'CSK', 
      color: '#FDB913', 
      purse: 12000,
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Chennai_Super_Kings_Logo.svg/1200px-Chennai_Super_Kings_Logo.svg.png'
    },
    { 
      name: 'Mumbai Indians', 
      shortName: 'MI', 
      color: '#004BA0', 
      purse: 12000,
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Mumbai_Indians_Logo.svg/1200px-Mumbai_Indians_Logo.svg.png'
    },
    { 
      name: 'Royal Challengers Bangalore', 
      shortName: 'RCB', 
      color: '#EC1C24', 
      purse: 12000,
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/Royal_Challengers_Bangalore_2020.svg/1200px-Royal_Challengers_Bangalore_2020.svg.png'
    },
    { 
      name: 'Kolkata Knight Riders', 
      shortName: 'KKR', 
      color: '#3A225D', 
      purse: 12000,
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Kolkata_Knight_Riders_Logo.svg/1200px-Kolkata_Knight_Riders_Logo.svg.png'
    },
    { 
      name: 'Delhi Capitals', 
      shortName: 'DC', 
      color: '#004C93', 
      purse: 12000,
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Delhi_Capitals_Logo.svg/1200px-Delhi_Capitals_Logo.svg.png'
    },
    { 
      name: 'Rajasthan Royals', 
      shortName: 'RR', 
      color: '#254AA5', 
      purse: 12000,
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/60/Rajasthan_Royals_Logo.svg/1200px-Rajasthan_Royals_Logo.svg.png'
    },
    { 
      name: 'Punjab Kings', 
      shortName: 'PBKS', 
      color: '#DD1F2D', 
      purse: 12000,
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f0/Punjab_Kings_Logo.svg/1200px-Punjab_Kings_Logo.svg.png'
    },
    { 
      name: 'Sunrisers Hyderabad', 
      shortName: 'SRH', 
      color: '#FF822A', 
      purse: 12000,
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/81/Sunrisers_Hyderabad.svg/1200px-Sunrisers_Hyderabad.svg.png'
    },
    { 
      name: 'Gujarat Titans', 
      shortName: 'GT', 
      color: '#1C2A3A', 
      purse: 12000,
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/99/Gujarat_Titans_Logo.svg/1200px-Gujarat_Titans_Logo.svg.png'
    },
    { 
      name: 'Lucknow Super Giants', 
      shortName: 'LSG', 
      color: '#D4AF37', 
      purse: 12000,
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Lucknow_Super_Giants_Logo.svg/1200px-Lucknow_Super_Giants_Logo.svg.png'
    },
  ];

  for (const team of teams) {
    await Team.create(team);
  }
};

/**
 * Create sample players
 */
const createSamplePlayers = async () => {
  const players = [
    {
      name: 'Virat Kohli',
      role: 'Batsman',
      basePrice: 150,
      nationality: 'India',
      age: 35,
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm medium',
      stats: { matches: 250, runs: 12000, wickets: 4, average: 52.5, strikeRate: 93.2 },
    },
    {
      name: 'Rohit Sharma',
      role: 'Batsman',
      basePrice: 160,
      nationality: 'India',
      age: 36,
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm offbreak',
      stats: { matches: 230, runs: 9500, wickets: 8, average: 48.2, strikeRate: 89.5 },
    },
    {
      name: 'MS Dhoni',
      role: 'Wicketkeeper',
      basePrice: 200,
      nationality: 'India',
      age: 42,
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm medium',
      stats: { matches: 250, runs: 5000, wickets: 0, average: 38.5, strikeRate: 135.2 },
    },
    {
      name: 'Jasprit Bumrah',
      role: 'Bowler',
      basePrice: 120,
      nationality: 'India',
      age: 30,
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm fast',
      stats: { matches: 120, runs: 50, wickets: 150, average: 24.5, strikeRate: 45.2 },
    },
    {
      name: 'Ravindra Jadeja',
      role: 'All-rounder',
      basePrice: 110,
      nationality: 'India',
      age: 34,
      battingStyle: 'Left-hand bat',
      bowlingStyle: 'Slow left-arm orthodox',
      stats: { matches: 200, runs: 2500, wickets: 120, average: 32.5, strikeRate: 125.8 },
    },
  ];

  for (const player of players) {
    await Player.create(player);
  }
};

// Run initialization
initDatabase();
