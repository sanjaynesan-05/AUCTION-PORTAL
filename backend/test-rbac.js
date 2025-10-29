/**
 * WebSocket Role-Based Access Control Test
 * Tests different user roles and their permissions
 */

const io = require('socket.io-client');
const jwt = require('jsonwebtoken');
require('dotenv').config();

console.log('🧪 WebSocket RBAC Test Starting...\n');
console.log('Testing Role-Based Access Control\n');
console.log('═'.repeat(60));

// Test different roles
const roles = ['admin', 'presenter', 'viewer'];
let testResults = [];

// Generate token for a specific role
function generateToken(role, username) {
  return jwt.sign(
    {
      id: role === 'admin' ? 1 : role === 'presenter' ? 2 : 3,
      username: username,
      role: role
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// Test function for each role
function testRole(role, callback) {
  const token = generateToken(role, `${role}-user`);
  
  console.log(`\n📋 Testing Role: ${role.toUpperCase()}`);
  console.log('─'.repeat(60));
  
  const socket = io(`http://localhost:${process.env.PORT || 5000}`, {
    auth: { token },
    transports: ['websocket']
  });

  const results = {
    role: role,
    connected: false,
    events: {}
  };

  socket.on('connect', () => {
    results.connected = true;
    console.log(`✅ ${role} connected - Socket ID: ${socket.id}`);
    
    // Test permissions after connection
    setTimeout(() => {
      // Test 1: Listen to auction-state (All roles should receive this)
      socket.once('auction-state', (data) => {
        results.events['auction-state'] = true;
        console.log(`   ✅ Can receive 'auction-state' events`);
      });

      // Test 2: Start auction
      socket.emit('start-auction', {});
      setTimeout(() => {
        // If no error, it was successful
        if (!results.events['start-auction-error']) {
          results.events['start-auction'] = true;
          console.log(`   ✅ Can emit 'start-auction'`);
        }
      }, 200);

      // Test 3: Pause auction
      setTimeout(() => {
        socket.emit('pause-auction', {});
        setTimeout(() => {
          if (!results.events['pause-auction-error']) {
            results.events['pause-auction'] = true;
            console.log(`   ✅ Can emit 'pause-auction'`);
          }
        }, 200);
      }, 400);

      // Test 4: Set current player
      setTimeout(() => {
        socket.emit('set-current-player', { playerId: 1 });
        setTimeout(() => {
          if (!results.events['set-current-player-error']) {
            results.events['set-current-player'] = true;
            console.log(`   ✅ Can emit 'set-current-player'`);
          }
        }, 200);
      }, 800);

      // Test 5: Place bid
      setTimeout(() => {
        socket.emit('place-bid', { teamId: 1, bidAmount: 15000000 });
        setTimeout(() => {
          if (!results.events['place-bid-error']) {
            results.events['place-bid'] = true;
            console.log(`   ✅ Can emit 'place-bid'`);
          }
        }, 200);
      }, 1200);

      // Test 6: Assign player (using mark-sold)
      setTimeout(() => {
        socket.emit('mark-sold', {});
        setTimeout(() => {
          if (!results.events['assign-player-error']) {
            results.events['assign-player'] = true;
            console.log(`   ✅ Can emit 'mark-sold' (assign player)`);
          }
        }, 200);
      }, 1600);

      // Test 7: Reset auction
      setTimeout(() => {
        socket.emit('reset-auction', {});
        setTimeout(() => {
          if (!results.events['reset-auction-error']) {
            results.events['reset-auction'] = true;
            console.log(`   ✅ Can emit 'reset-auction'`);
          }
          
          // Finish this role test
          socket.close();
          testResults.push(results);
          callback();
        }, 200);
      }, 2000);
    }, 500);
  });

  socket.on('error', (error) => {
    const message = error.message.toLowerCase();
    if (message.includes('start')) {
      results.events['start-auction-error'] = true;
      console.log(`   ❌ Cannot emit 'start-auction' - ${error.message}`);
    } else if (message.includes('pause')) {
      results.events['pause-auction-error'] = true;
      console.log(`   ❌ Cannot emit 'pause-auction' - ${error.message}`);
    } else if (message.includes('set')) {
      results.events['set-current-player-error'] = true;
      console.log(`   ❌ Cannot emit 'set-current-player' - ${error.message}`);
    } else if (message.includes('bid')) {
      results.events['place-bid-error'] = true;
      console.log(`   ❌ Cannot emit 'place-bid' - ${error.message}`);
    } else if (message.includes('sold') || message.includes('mark')) {
      results.events['assign-player-error'] = true;
      console.log(`   ❌ Cannot emit 'mark-sold' (assign player) - ${error.message}`);
    } else if (message.includes('reset')) {
      results.events['reset-auction-error'] = true;
      console.log(`   ❌ Cannot emit 'reset-auction' - ${error.message}`);
    }
  });

  socket.on('connect_error', (error) => {
    console.log(`❌ Connection failed for ${role}: ${error.message}`);
    callback();
  });
}

// Run tests sequentially
function runTests() {
  let index = 0;
  
  function next() {
    if (index < roles.length) {
      testRole(roles[index], () => {
        index++;
        next();
      });
    } else {
      // All tests complete, show summary
      showSummary();
    }
  }
  
  next();
}

function showSummary() {
  console.log('\n\n' + '═'.repeat(60));
  console.log('📊 ROLE-BASED ACCESS CONTROL SUMMARY');
  console.log('═'.repeat(60));
  
  console.log('\n┌─────────────────────────┬───────┬───────────┬─────────┐');
  console.log('│ Event                   │ Admin │ Presenter │ Viewer  │');
  console.log('├─────────────────────────┼───────┼───────────┼─────────┤');
  
  const events = [
    'auction-state',
    'start-auction',
    'pause-auction',
    'set-current-player',
    'place-bid',
    'assign-player',
    'reset-auction'
  ];
  
  events.forEach(event => {
    const adminResult = testResults[0]?.events[event] ? '  ✅   ' : '  ❌   ';
    const presenterResult = testResults[1]?.events[event] ? '    ✅    ' : '    ❌    ';
    const viewerResult = testResults[2]?.events[event] ? '   ✅   ' : '   ❌   ';
    
    const eventName = event.padEnd(23);
    console.log(`│ ${eventName} │${adminResult}│${presenterResult}│${viewerResult}│`);
  });
  
  console.log('└─────────────────────────┴───────┴───────────┴─────────┘');
  
  console.log('\n✅ Expected Permissions:');
  console.log('   • Admin: Full access to all events');
  console.log('   • Presenter: Can control auction (no reset)');
  console.log('   • Viewer: Can only place bids and receive updates');
  
  console.log('\n✅ Test Complete!\n');
  process.exit(0);
}

// Start tests
setTimeout(runTests, 500);
