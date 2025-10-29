const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { connectDB } = require('./database');
const { Player, Team, sequelize } = require('./models');

// Import routes
const authRoutes = require('./routes/auth.routes');
const playerRoutes = require('./routes/players.routes');
const teamRoutes = require('./routes/teams.routes');

// Initialize Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to PostgreSQL
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/teams', teamRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    database: sequelize.config.database,
    timestamp: new Date().toISOString(),
  });
});

// In-memory auction state for real-time performance
let auctionState = {
  started: false,
  paused: false,
  currentPlayer: null,
  currentBid: 0,
  currentTeam: null,
  players: [],
  teams: [],
  bidHistory: [],
};

// Initialize auction state from database
const initializeAuctionState = async () => {
  try {
    // Check if PostgreSQL is connected
    await sequelize.authenticate();

    const players = await Player.findAll({
      include: [
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'name', 'shortName', 'color'],
        },
      ],
      raw: false,
    });

    const teams = await Team.findAll({
      include: [
        {
          model: Player,
          as: 'players',
          attributes: ['id', 'name', 'role', 'price'],
        },
      ],
      raw: false,
    });

    // Convert Sequelize instances to plain objects
    auctionState.players = players.map((p) => p.toJSON());
    auctionState.teams = teams.map((t) => t.toJSON());

    console.log('✅ Auction state initialized from database');
    console.log(`📊 Players loaded: ${auctionState.players.length}`);
    console.log(`🏆 Teams loaded: ${auctionState.teams.length}`);
  } catch (error) {
    console.error('❌ Failed to initialize auction state:', error.message);
    console.log('💡 Server will continue running. Auction state will be initialized when database is available.');
  }
};

// Initialize auction state after database connection
sequelize
  .authenticate()
  .then(async () => {
    console.log('📡 PostgreSQL connected. Initializing auction state...');
    await initializeAuctionState();
  })
  .catch((err) => {
    console.error('❌ PostgreSQL connection error:', err.message);
  });

// Socket.io authentication middleware
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error('Socket authentication error:', error.message);
    next(new Error('Authentication error: Invalid token'));
  }
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id} (${socket.user.username} - ${socket.user.role})`);

  // Send current auction state to newly connected client
  socket.emit('auction-state', auctionState);

  // Handle start auction event (Admin/Presenter only)
  socket.on('start-auction', async (data) => {
    try {
      if (!['admin', 'presenter'].includes(socket.user.role)) {
        socket.emit('error', { message: 'Unauthorized: Only admin/presenter can start auction' });
        return;
      }

      auctionState.started = true;
      auctionState.paused = false;

      console.log(`🎬 Auction started by ${socket.user.username}`);

      // Broadcast updated state to all clients
      io.emit('auction-state', auctionState);
    } catch (error) {
      console.error('Start auction error:', error);
      socket.emit('error', { message: 'Failed to start auction' });
    }
  });

  // Handle pause auction event (Admin/Presenter only)
  socket.on('pause-auction', async (data) => {
    try {
      if (!['admin', 'presenter'].includes(socket.user.role)) {
        socket.emit('error', { message: 'Unauthorized: Only admin/presenter can pause auction' });
        return;
      }

      auctionState.paused = !auctionState.paused;

      console.log(`⏸️  Auction ${auctionState.paused ? 'paused' : 'resumed'} by ${socket.user.username}`);

      io.emit('auction-state', auctionState);
    } catch (error) {
      console.error('Pause auction error:', error);
      socket.emit('error', { message: 'Failed to pause auction' });
    }
  });

  // Handle set current player event (Admin/Presenter only)
  socket.on('set-current-player', async (data) => {
    try {
      if (!['admin', 'presenter'].includes(socket.user.role)) {
        socket.emit('error', { message: 'Unauthorized: Only admin/presenter can set player' });
        return;
      }

      const { playerId } = data;
      const player = auctionState.players.find(p => p.id === playerId);

      if (!player) {
        socket.emit('error', { message: 'Player not found' });
        return;
      }

      auctionState.currentPlayer = player;
      auctionState.currentBid = parseFloat(player.basePrice);
      auctionState.currentTeam = null;

      console.log(`👤 Current player set to: ${player.name} by ${socket.user.username}`);

      io.emit('auction-state', auctionState);
    } catch (error) {
      console.error('Set current player error:', error);
      socket.emit('error', { message: 'Failed to set current player' });
    }
  });

  // Handle place bid event (Admin/Presenter only)
  socket.on('place-bid', async (data) => {
    try {
      if (!['admin', 'presenter'].includes(socket.user.role)) {
        socket.emit('error', { message: 'Unauthorized: Only admin/presenter can place bids' });
        return;
      }

      const { teamId, bidAmount } = data;

      if (!auctionState.currentPlayer) {
        socket.emit('error', { message: 'No player is currently being auctioned' });
        return;
      }

      const team = auctionState.teams.find(t => t.id === teamId);
      if (!team) {
        socket.emit('error', { message: 'Team not found' });
        return;
      }

      const teamPurse = parseFloat(team.purse);
      const bid = parseFloat(bidAmount);

      if (teamPurse < bid) {
        socket.emit('error', { message: 'Insufficient purse balance' });
        return;
      }

      if (bid <= auctionState.currentBid) {
        socket.emit('error', { message: 'Bid must be higher than current bid' });
        return;
      }

      auctionState.currentBid = bid;
      auctionState.currentTeam = team;

      // Add to bid history
      auctionState.bidHistory.push({
        playerId: auctionState.currentPlayer.id,
        playerName: auctionState.currentPlayer.name,
        teamId: team.id,
        teamName: team.shortName,
        amount: bid,
        timestamp: new Date(),
        user: socket.user.username,
      });

      console.log(`💰 Bid placed: ${team.shortName} - ₹${bid}L for ${auctionState.currentPlayer.name}`);

      io.emit('auction-state', auctionState);
    } catch (error) {
      console.error('Place bid error:', error);
      socket.emit('error', { message: 'Failed to place bid' });
    }
  });

  // Handle mark player as sold (Admin/Presenter only)
  socket.on('mark-sold', async (data) => {
    try {
      if (!['admin', 'presenter'].includes(socket.user.role)) {
        socket.emit('error', { message: 'Unauthorized: Only admin/presenter can mark as sold' });
        return;
      }

      if (!auctionState.currentPlayer || !auctionState.currentTeam) {
        socket.emit('error', { message: 'No active bid to finalize' });
        return;
      }

      const playerId = auctionState.currentPlayer.id;
      const teamId = auctionState.currentTeam.id;
      const finalPrice = auctionState.currentBid;

      // Update database
      const player = await Player.findByPk(playerId);
      await player.update({
        sold: true,
        teamId: teamId,
        price: finalPrice,
      });

      const team = await Team.findByPk(teamId);
      await team.addPlayerToTeam(playerId, finalPrice);

      // Update in-memory state
      const playerIndex = auctionState.players.findIndex(p => p.id === playerId);
      if (playerIndex !== -1) {
        auctionState.players[playerIndex] = {
          ...auctionState.players[playerIndex],
          sold: true,
          teamId,
          price: finalPrice,
        };
      }

      const teamIndex = auctionState.teams.findIndex(t => t.id === teamId);
      if (teamIndex !== -1) {
        const updatedTeam = await Team.findByPk(teamId, {
          include: [
            {
              model: Player,
              as: 'players',
              attributes: ['id', 'name', 'role', 'price'],
            },
          ],
        });
        auctionState.teams[teamIndex] = updatedTeam.toJSON();
      }

      console.log(`✅ Player sold: ${auctionState.currentPlayer.name} to ${auctionState.currentTeam.shortName} for ₹${finalPrice}L`);

      // Reset current player and bid
      auctionState.currentPlayer = null;
      auctionState.currentBid = 0;
      auctionState.currentTeam = null;

      io.emit('auction-state', auctionState);
    } catch (error) {
      console.error('Mark sold error:', error);
      socket.emit('error', { message: 'Failed to mark player as sold' });
    }
  });

  // Handle mark player as unsold (Admin/Presenter only)
  socket.on('mark-unsold', async (data) => {
    try {
      if (!['admin', 'presenter'].includes(socket.user.role)) {
        socket.emit('error', { message: 'Unauthorized: Only admin/presenter can mark as unsold' });
        return;
      }

      if (!auctionState.currentPlayer) {
        socket.emit('error', { message: 'No player is currently being auctioned' });
        return;
      }

      console.log(`❌ Player unsold: ${auctionState.currentPlayer.name}`);

      // Reset current player and bid
      auctionState.currentPlayer = null;
      auctionState.currentBid = 0;
      auctionState.currentTeam = null;

      io.emit('auction-state', auctionState);
    } catch (error) {
      console.error('Mark unsold error:', error);
      socket.emit('error', { message: 'Failed to mark player as unsold' });
    }
  });

  // Handle reset auction (Admin only)
  socket.on('reset-auction', async (data) => {
    try {
      if (socket.user.role !== 'admin') {
        socket.emit('error', { message: 'Unauthorized: Only admin can reset auction' });
        return;
      }

      // Reset all players in database
      await Player.update(
        { sold: false, teamId: null, price: null },
        { where: {} }
      );

      // Reset all teams in database
      await Team.update(
        { purse: 12000 },
        { where: {} }
      );

      // Reinitialize auction state
      await initializeAuctionState();

      auctionState.started = false;
      auctionState.paused = false;
      auctionState.currentPlayer = null;
      auctionState.currentBid = 0;
      auctionState.currentTeam = null;
      auctionState.bidHistory = [];

      console.log(`🔄 Auction reset by ${socket.user.username}`);

      io.emit('auction-state', auctionState);
    } catch (error) {
      console.error('Reset auction error:', error);
      socket.emit('error', { message: 'Failed to reset auction' });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id} (${socket.user.username})`);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📱 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: PostgreSQL\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});
