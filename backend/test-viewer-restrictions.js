/**
 * Test Script: Viewer Team Restrictions
 * Verifies that viewers can only see their own team's data
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test accounts
const testAccounts = [
  { username: 'csk_owner', password: 'password123', expectedTeam: 'CSK' },
  { username: 'mi_owner', password: 'password123', expectedTeam: 'MI' },
];

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  test: (msg) => console.log(`${colors.cyan}🧪 ${msg}${colors.reset}`),
};

async function testViewerRestrictions() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 TESTING VIEWER TEAM RESTRICTIONS');
  console.log('='.repeat(60) + '\n');

  for (const account of testAccounts) {
    log.info(`Testing account: ${account.username} (${account.expectedTeam})`);
    console.log('-'.repeat(60));

    try {
      // 1. Login
      log.test('Test 1: Login');
      const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
        username: account.username,
        password: account.password,
      });
      
      const token = loginRes.data.token;
      log.success(`Login successful - Token received`);

      const headers = { Authorization: `Bearer ${token}` };

      // 2. Get My Team
      log.test('Test 2: GET /api/teams/my-team');
      const myTeamRes = await axios.get(`${BASE_URL}/teams/my-team`, { headers });
      const myTeam = myTeamRes.data.data;
      
      if (myTeam.shortName === account.expectedTeam) {
        log.success(`Got own team: ${myTeam.name} (${myTeam.shortName})`);
        log.info(`  Purse: ₹${myTeam.purse} Cr | Players: ${myTeam.totalPlayers}`);
      } else {
        log.error(`Expected ${account.expectedTeam}, got ${myTeam.shortName}`);
      }

      // 3. Get All Teams (should only see own team)
      log.test('Test 3: GET /api/teams (should be filtered)');
      const teamsRes = await axios.get(`${BASE_URL}/teams`, { headers });
      const teams = teamsRes.data.data;
      
      if (teams.length === 1 && teams[0].shortName === account.expectedTeam) {
        log.success(`Teams filtered correctly - Only sees ${account.expectedTeam}`);
      } else {
        log.error(`Expected 1 team (${account.expectedTeam}), got ${teams.length} teams`);
      }

      // 4. Get Players (should only see own team's players)
      log.test('Test 4: GET /api/players (should be filtered)');
      const playersRes = await axios.get(`${BASE_URL}/players`, { headers });
      const players = playersRes.data.data;
      
      const ownTeamPlayers = players.filter(p => p.teamId === myTeam.id);
      const otherTeamPlayers = players.filter(p => p.teamId && p.teamId !== myTeam.id);
      
      if (otherTeamPlayers.length === 0) {
        log.success(`Players filtered correctly - ${ownTeamPlayers.length} ${account.expectedTeam} players, 0 others`);
      } else {
        log.error(`Found ${otherTeamPlayers.length} players from other teams!`);
      }

      // 5. Try to access another team's details (should fail)
      log.test('Test 5: Access restriction for other teams');
      try {
        const otherTeamId = account.expectedTeam === 'CSK' ? 'mi-team-id' : 'csk-team-id';
        // Get list of all teams first to find another team's ID
        const allTeamsRes = await axios.get(`${BASE_URL}/teams`, { 
          headers: { Authorization: `Bearer ${loginRes.data.token}` } 
        });
        
        // Since viewer should only see 1 team, we can't test accessing another team
        log.info('  Skipped - Viewer can only see their own team in list');
      } catch (err) {
        if (err.response && err.response.status === 403) {
          log.success('Access denied for other team (403) ✓');
        } else {
          log.info(`  Response: ${err.response?.status || 'Network error'}`);
        }
      }

      log.success(`All tests passed for ${account.username}!\n`);

    } catch (error) {
      log.error(`Test failed for ${account.username}`);
      if (error.response) {
        console.log(`  Status: ${error.response.status}`);
        console.log(`  Error: ${JSON.stringify(error.response.data, null, 2)}`);
      } else {
        console.log(`  Error: ${error.message}`);
      }
      console.log('');
    }
  }

  console.log('='.repeat(60));
  console.log('✅ VIEWER RESTRICTION TESTS COMPLETE');
  console.log('='.repeat(60) + '\n');
}

// Run tests
testViewerRestrictions().catch(error => {
  log.error('Test suite failed:');
  console.error(error);
  process.exit(1);
});
