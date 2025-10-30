const { sequelize, Team } = require('../models');
require('dotenv').config();

/**
 * Update IPL team logos in the database
 */
const updateTeamLogos = async () => {
  try {
    console.log('🔄 Updating IPL team logos...\n');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established\n');

    const teamLogos = {
      'Chennai Super Kings': 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Chennai_Super_Kings_Logo.svg/1200px-Chennai_Super_Kings_Logo.svg.png',
      'Mumbai Indians': 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Mumbai_Indians_Logo.svg/1200px-Mumbai_Indians_Logo.svg.png',
      'Royal Challengers Bangalore': 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/Royal_Challengers_Bangalore_2020.svg/1200px-Royal_Challengers_Bangalore_2020.svg.png',
      'Kolkata Knight Riders': 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Kolkata_Knight_Riders_Logo.svg/1200px-Kolkata_Knight_Riders_Logo.svg.png',
      'Delhi Capitals': 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Delhi_Capitals_Logo.svg/1200px-Delhi_Capitals_Logo.svg.png',
      'Rajasthan Royals': 'https://upload.wikimedia.org/wikipedia/en/thumb/6/60/Rajasthan_Royals_Logo.svg/1200px-Rajasthan_Royals_Logo.svg.png',
      'Punjab Kings': 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f0/Punjab_Kings_Logo.svg/1200px-Punjab_Kings_Logo.svg.png',
      'Sunrisers Hyderabad': 'https://upload.wikimedia.org/wikipedia/en/thumb/8/81/Sunrisers_Hyderabad.svg/1200px-Sunrisers_Hyderabad.svg.png',
      'Gujarat Titans': 'https://upload.wikimedia.org/wikipedia/en/thumb/9/99/Gujarat_Titans_Logo.svg/1200px-Gujarat_Titans_Logo.svg.png',
      'Lucknow Super Giants': 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Lucknow_Super_Giants_Logo.svg/1200px-Lucknow_Super_Giants_Logo.svg.png',
    };

    let updatedCount = 0;

    for (const [teamName, logoUrl] of Object.entries(teamLogos)) {
      const result = await Team.update(
        { logo: logoUrl },
        { 
          where: { name: teamName },
          returning: true
        }
      );

      if (result[0] > 0) {
        console.log(`✅ Updated logo for: ${teamName}`);
        updatedCount++;
      } else {
        console.log(`⚠️  Team not found: ${teamName}`);
      }
    }

    console.log(`\n✅ Successfully updated ${updatedCount} team logos!\n`);

    // Display all teams with their logos
    const teams = await Team.findAll({
      attributes: ['name', 'shortName', 'logo'],
      order: [['name', 'ASC']],
    });

    console.log('📋 Current team logos:');
    console.log('─'.repeat(80));
    teams.forEach(team => {
      console.log(`${team.shortName.padEnd(6)} | ${team.name.padEnd(30)} | ${team.logo ? '✓' : '✗'}`);
    });
    console.log('─'.repeat(80));

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to update team logos:', error);
    process.exit(1);
  }
};

// Run the update
updateTeamLogos();
