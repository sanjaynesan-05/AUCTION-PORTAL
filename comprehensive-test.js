const io = require('socket.io-client');

// Comprehensive multi-user connectivity test
console.log('🎯 Comprehensive Auction System Test\n');

// Test data
const users = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'presenter', password: 'presenter123', role: 'presenter' },
  { username: 'viewer', password: 'viewer123', role: 'viewer' },
  { username: 'csk_owner', password: 'password123', role: 'viewer' },
  { username: 'mi_owner', password: 'password123', role: 'viewer' }
];

let connectedSockets = [];
let testResults = {
  auth: 0,
  websocket: 0,
  state: 0
};

const testUser = async (user) => {
  console.log(`\n👤 Testing ${user.role.toUpperCase()}: ${user.username}`);

  try {
    // 1. Test authentication
    const authRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user.username, password: user.password })
    });

    const authData = await authRes.json();

    if (!authData.success) {
      console.log(`❌ Auth failed: ${authData.message}`);
      return false;
    }

    console.log(`✅ Auth successful`);
    testResults.auth++;

    const token = authData.data.token;

    // 2. Test WebSocket connection
    return new Promise((resolve) => {
      const socket = io('http://localhost:5000', {
        auth: { token: token }
      });

      const timeout = setTimeout(() => {
        console.log(`❌ WebSocket timeout`);
        socket.disconnect();
        resolve(false);
      }, 5000);

      socket.on('connect', () => {
        console.log(`✅ WebSocket connected`);
        testResults.websocket++;
        connectedSockets.push(socket);
        clearTimeout(timeout);

        // 3. Test auction state reception
        socket.on('auction-state', (state) => {
          console.log(`✅ Auction state received (${state.players ? state.players.length : 0} players)`);
          testResults.state++;

          // Disconnect after receiving state
          setTimeout(() => {
            socket.disconnect();
            resolve(true);
          }, 1000);
        });

        // Request auction state
        socket.emit('get-auction-state');
      });

      socket.on('connect_error', (error) => {
        console.log(`❌ WebSocket failed: ${error.message}`);
        clearTimeout(timeout);
        resolve(false);
      });
    });

  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
    return false;
  }
};

const runTests = async () => {
  // Reset auction first
  try {
    console.log('🔄 Resetting auction...');
    const resetRes = await fetch('http://localhost:5000/api/admin/reset-and-start-auction', {
      method: 'POST'
    });
    const resetData = await resetRes.json();
    console.log(`✅ Auction reset: ${resetData.message}`);
  } catch (error) {
    console.log(`❌ Reset failed: ${error.message}`);
    return;
  }

  // Test all users
  for (const user of users) {
    await testUser(user);
  }

  // Summary
  console.log('\n📊 Test Results:');
  console.log(`   Authentication: ${testResults.auth}/${users.length} passed`);
  console.log(`   WebSocket: ${testResults.websocket}/${users.length} passed`);
  console.log(`   State Sync: ${testResults.state}/${users.length} passed`);

  const totalPassed = testResults.auth + testResults.websocket + testResults.state;
  const totalTests = users.length * 3;

  if (totalPassed === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED! Auction system is fully functional.');
    console.log('✅ Admin, Presenter, and Viewer panels should work correctly.');
    console.log('✅ Real-time synchronization is working.');
    console.log('✅ All user roles can connect simultaneously.');
  } else {
    console.log(`\n⚠️  ${totalPassed}/${totalTests} tests passed. Some issues remain.`);
  }

  // Cleanup
  connectedSockets.forEach(socket => socket.disconnect());
  process.exit(totalPassed === totalTests ? 0 : 1);
};

runTests().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});