/**
 * Script: Assign Teams to Viewer Accounts
 * Creates viewer accounts for each team or assigns existing viewers to teams
 */

const { User, Team } = require('../models');
require('dotenv').config();

const assignTeamsToViewers = async () => {
  try {
    console.log('🔄 Starting team assignment process...\n');

    // Get all teams
    const teams = await Team.findAll({
      order: [['name', 'ASC']],
    });

    if (teams.length === 0) {
      console.log('❌ No teams found in database!');
      console.log('   Please run: npm run init-db\n');
      process.exit(1);
    }

    console.log(`✅ Found ${teams.length} teams:\n`);
    teams.forEach(team => {
      console.log(`   - ${team.shortName}: ${team.name}`);
    });
    console.log('');

    // Option 1: Create new viewers for each team
    console.log('Creating viewer accounts for each team...\n');

    for (const team of teams) {
      const username = `${team.shortName.toLowerCase()}_owner`;
      
      // Check if viewer already exists
      const existingUser = await User.findOne({ where: { username } });
      
      if (existingUser) {
        // Update existing user's teamId
        if (!existingUser.teamId) {
          await existingUser.update({ teamId: team.id });
          console.log(`✅ Updated: ${username} → ${team.shortName} (${team.name})`);
        } else {
          console.log(`ℹ️  Skipped: ${username} (already assigned to a team)`);
        }
      } else {
        // Create new viewer
        await User.create({
          username: username,
          password: 'password123', // Default password - users should change this!
          role: 'viewer',
          teamId: team.id,
        });
        console.log(`✅ Created: ${username} → ${team.shortName} (${team.name})`);
      }
    }

    console.log('\n✅ Team assignment complete!\n');
    console.log('📋 Viewer Accounts Created:');
    console.log('─'.repeat(60));
    
    const viewers = await User.findAll({
      where: { role: 'viewer' },
      include: [{ model: Team, as: 'Team', attributes: ['name', 'shortName', 'color'] }],
    });

    if (viewers.length === 0) {
      console.log('   No viewers found.\n');
    } else {
      console.log(`   Username             | Team      | Full Name`);
      console.log('─'.repeat(60));
      viewers.forEach(viewer => {
        const teamInfo = viewer.Team 
          ? `${viewer.Team.shortName.padEnd(9)}| ${viewer.Team.name}` 
          : 'Not Assigned';
        console.log(`   ${viewer.username.padEnd(20)}| ${teamInfo}`);
      });
      console.log('─'.repeat(60));
    }

    console.log('\n⚠️  Default Password: password123');
    console.log('   Users should change their password after first login!\n');

    console.log('🔐 Login Credentials:');
    console.log('   Username: <team>_owner (e.g., csk_owner)');
    console.log('   Password: password123\n');

    console.log('📝 Next Steps:');
    console.log('   1. Start the server: npm start');
    console.log('   2. Login with viewer credentials');
    console.log('   3. Viewers will only see their own team\'s data\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Team assignment failed:', error);
    console.error('\nError details:', error.message);
    process.exit(1);
  }
};

// Run the script
assignTeamsToViewers();
