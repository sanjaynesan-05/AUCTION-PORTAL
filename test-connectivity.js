const io = require('socket.io-client');

// Test auction state
console.log('🔍 Testing Auction System Connectivity...\n');

// First authenticate and get token
const tryPasswords = ['Presenter123', 'presenter123', 'presenter'];

const tryAuth = (password) => {
  return fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'presenter', password: password })
  })
  .then(res => res.json())
  .then(authData => {
    if (authData.success) {
      console.log(`✅ Authentication successful with password: ${password}`);
      return authData.data.token;
    } else {
      throw new Error(`Auth failed for ${password}: ${authData.message}`);
    }
  });
};

const tryAllPasswords = async () => {
  for (const password of tryPasswords) {
    try {
      return await tryAuth(password);
    } catch (error) {
      console.log(`❌ ${error.message}`);
    }
  }
  throw new Error('All passwords failed');
};

(async () => {
  try {
    const token = await tryAllPasswords();

    // Now check auction state via HTTP
    const healthRes = await fetch('http://localhost:5000/api/health');
    const healthData = await healthRes.json();
    console.log('✅ Backend Health:', healthData.message);

    const resetRes = await fetch('http://localhost:5000/api/admin/reset-and-start-auction', {
      method: 'POST'
    });
    const resetData = await resetRes.json();
    console.log('✅ Auction Reset Result:', resetData.message);
    console.log('📊 Current Player:', resetData.currentPlayer);
    console.log('👥 Total Players:', resetData.totalPlayers);
    console.log('🎯 Unsold Players:', resetData.unsoldPlayers);

    // Now test WebSocket connection with real token
    console.log('\n🔌 Testing WebSocket Connection...');

    const socket = io('http://localhost:5000', {
      auth: { token: token }
    });

    socket.on('connect', () => {
      console.log('✅ WebSocket connected successfully');
      console.log('🆔 Socket ID:', socket.id);
    });

    socket.on('auction-state', (state) => {
      console.log('📡 Auction State Received:');
      console.log('   - Started:', state.started);
      console.log('   - Current Player:', state.currentPlayer ? state.currentPlayer.name : 'None');
      console.log('   - Total Players:', state.players ? state.players.length : 0);
      console.log('   - Unsold Players:', state.players ? state.players.filter(p => !p.sold).length : 0);

      socket.disconnect();
      console.log('\n🎉 All connectivity tests passed!');
      process.exit(0);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection failed:', error.message);
      process.exit(1);
    });

    socket.on('error', (error) => {
      console.error('❌ WebSocket error:', error.message);
      process.exit(1);
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      console.error('❌ WebSocket connection timeout');
      socket.disconnect();
      process.exit(1);
    }, 10000);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
})();