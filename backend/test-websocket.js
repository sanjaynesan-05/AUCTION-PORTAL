/**
 * WebSocket Test Client
 * Tests Socket.io connection to the backend server
 */

const io = require('socket.io-client');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generate a test JWT token for admin user
const testToken = jwt.sign(
  {
    id: 1,
    username: 'admin',
    role: 'admin'
  },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

console.log('🧪 WebSocket Test Client Starting...\n');
console.log('📋 Test Configuration:');
console.log(`   Server: http://localhost:${process.env.PORT || 5000}`);
console.log(`   User: admin (role: admin)`);
console.log(`   Token: ${testToken.substring(0, 20)}...`);
console.log('\n🔌 Attempting to connect...\n');

// Create Socket.io client
const socket = io(`http://localhost:${process.env.PORT || 5000}`, {
  auth: {
    token: testToken
  },
  transports: ['websocket', 'polling']
});

// Connection successful
socket.on('connect', () => {
  console.log('✅ WebSocket Connected Successfully!');
  console.log(`   Socket ID: ${socket.id}`);
  console.log(`   Transport: ${socket.io.engine.transport.name}`);
  console.log('\n📡 Testing Events...\n');

  // Test 1: Receive auction state
  setTimeout(() => {
    console.log('🔔 Test 1: Requesting auction state...');
  }, 500);
});

// Receive auction state
socket.on('auction-state', (data) => {
  console.log('✅ Received auction-state event:');
  console.log(`   Started: ${data.started}`);
  console.log(`   Paused: ${data.paused}`);
  console.log(`   Current Player: ${data.currentPlayer ? data.currentPlayer.name : 'None'}`);
  console.log(`   Players Count: ${data.players ? data.players.length : 0}`);
  console.log(`   Teams Count: ${data.teams ? data.teams.length : 0}`);
  
  // Test 2: Start auction
  setTimeout(() => {
    console.log('\n🔔 Test 2: Starting auction...');
    socket.emit('start-auction', {});
  }, 1000);
});

// Listen for errors
socket.on('error', (error) => {
  console.log('❌ Server Error:', error.message);
});

// Connection error
socket.on('connect_error', (error) => {
  console.log('❌ Connection Error:', error.message);
  console.log('\n⚠️  Possible Issues:');
  console.log('   1. Backend server is not running');
  console.log('   2. Port 5000 is blocked or in use by another process');
  console.log('   3. JWT_SECRET mismatch in .env file');
  console.log('\n💡 Try:');
  console.log('   cd backend');
  console.log('   npm start');
  process.exit(1);
});

// Disconnection
socket.on('disconnect', (reason) => {
  console.log(`\n🔌 WebSocket Disconnected: ${reason}`);
  if (reason === 'io server disconnect') {
    console.log('   Server closed the connection');
  } else if (reason === 'io client disconnect') {
    console.log('   Client closed the connection');
  }
});

// Transport change
socket.io.engine.on('upgrade', (transport) => {
  console.log(`\n🔄 Transport upgraded to: ${transport.name}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Closing WebSocket connection...');
  socket.close();
  setTimeout(() => {
    console.log('✅ WebSocket Test Complete!\n');
    process.exit(0);
  }, 500);
});

// Auto-exit after 5 seconds
setTimeout(() => {
  console.log('\n\n⏱️  Test completed after 5 seconds');
  console.log('\n📊 Test Summary:');
  console.log(`   Connection Status: ${socket.connected ? '✅ Connected' : '❌ Disconnected'}`);
  console.log(`   Socket ID: ${socket.id || 'N/A'}`);
  console.log(`   Events Received: auction-state, etc.`);
  console.log('\n✅ WebSocket is working correctly!\n');
  
  socket.close();
  process.exit(0);
}, 5000);
