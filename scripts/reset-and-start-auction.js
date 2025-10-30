const io = require('socket.io-client');

// Connect to the auction server
const socket = io('http://localhost:5000', {
  auth: {
    token: 'admin-token' // Using admin credentials
  }
});

socket.on('connect', () => {
  console.log('Connected to auction server');

  // First reset the auction
  console.log('Resetting auction...');
  socket.emit('reset-auction', {});

  // Wait a moment then start the auction
  setTimeout(() => {
    console.log('Starting auction...');
    socket.emit('start-auction', {});
  }, 2000);
});

socket.on('auction-state', (state) => {
  console.log('Auction state updated:', {
    started: state.started,
    currentPlayer: state.currentPlayer ? state.currentPlayer.name : 'None',
    totalPlayers: state.players.length,
    unsoldPlayers: state.players.filter(p => !p.sold).length
  });

  // Disconnect after receiving the state update
  setTimeout(() => {
    socket.disconnect();
    console.log('Auction reset and started successfully!');
  }, 1000);
});

socket.on('error', (error) => {
  console.error('Error:', error.message);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});