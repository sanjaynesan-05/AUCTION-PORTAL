import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useAuctionSync } from '../hooks/useAuctionSync';
import {
  LogOut,
  Users,
  TrendingUp,
  DollarSign,
  Settings,
  BarChart3,
  Trophy,
  Plus,
  Trash2,
  Edit,
  Crown,
  Activity,
  Target,
  Search,
  Download,
  X,
  Save
} from 'lucide-react';

export default function AdminPanel() {
  const { user, logout } = useRole();
  const navigate = useNavigate();
  const {
    players,
    teams,
    auctionStarted,
    currentPlayer,
    currentBid,
    resetAuction,
    addPlayer,
    removePlayer,
    markSold,
    markUnsold,
    setCurrentPlayer,
    getNextBidIncrement,
    updateBidDisplay,
  } = useAuctionSync();

  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<any>(null);
  
  // Bidding controls
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [selectedPlayerForBid, setSelectedPlayerForBid] = useState<any>(null);
  const [showSoldModal, setShowSoldModal] = useState(false);
  
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    role: 'Batsman',
    basePrice: 50,
    nationality: 'India',
    age: 25,
    battingStyle: 'Right-handed',
    bowlingStyle: '',
    image: '',
    stats: {
      matches: 0,
      runs: 0,
      wickets: 0,
      average: 0,
      strikeRate: 0
    }
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEditPlayer = (player: any) => {
    setEditingPlayer(player);
    setNewPlayer({
      name: player.name,
      role: player.role,
      basePrice: player.basePrice,
      nationality: player.nationality,
      age: player.age,
      battingStyle: player.battingStyle || '',
      bowlingStyle: player.bowlingStyle || '',
      image: player.image,
      stats: player.stats || {
        matches: 0,
        runs: 0,
        wickets: 0,
        average: 0,
        strikeRate: 0
      }
    });
    setShowEditModal(true);
  };

  const handleUpdatePlayer = () => {
    if (editingPlayer && newPlayer.name) {
      // Remove the old player and add the updated one
      removePlayer(editingPlayer.id);
      addPlayer({
        ...editingPlayer,
        ...newPlayer,
        id: editingPlayer.id,
        sold: editingPlayer.sold,
        teamId: editingPlayer.teamId,
        price: editingPlayer.price
      });
      setShowEditModal(false);
      setEditingPlayer(null);
      setNewPlayer({
        name: '',
        role: 'Batsman',
        basePrice: 50,
        nationality: 'India',
        age: 25,
        battingStyle: 'Right-handed',
        bowlingStyle: '',
        image: '',
        stats: {
          matches: 0,
          runs: 0,
          wickets: 0,
          average: 0,
          strikeRate: 0
        }
      });
    }
  };

  const handleDeletePlayer = (playerId: number) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      removePlayer(playerId);
    }
  };

  const handleExportPlayers = () => {
    const dataStr = JSON.stringify(players, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'players-data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Filter players based on search and filters
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.nationality.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || player.role === filterRole;
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'sold' && player.sold) ||
                         (filterStatus === 'available' && !player.sold);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const soldPlayers = players.filter(p => p.sold);
  const totalSpent = soldPlayers.reduce((sum, p) => sum + (p.price || 0), 0);
  const averagePrice = soldPlayers.length > 0 ? totalSpent / soldPlayers.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between h-auto sm:h-16 py-4 sm:py-0 space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">IPL Auction Portal</h1>
                <p className="text-xs sm:text-sm text-gray-300">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <div className="text-left sm:text-right">
                <p className="text-xs sm:text-sm text-gray-300">Administrator</p>
                <p className="text-white font-medium text-sm sm:text-base">{user?.username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Navigation Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-1 flex flex-wrap gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'bidding', label: 'Bidding', icon: Target },
              { id: 'players', label: 'Players', icon: Users },
              { id: 'teams', label: 'Teams', icon: Trophy },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 sm:px-4 py-2 rounded-md transition-all text-sm sm:text-base ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-1 sm:mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Players</p>
                    <p className="text-3xl font-bold text-white">{players.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Players Sold</p>
                    <p className="text-3xl font-bold text-green-400">{soldPlayers.length}</p>
                  </div>
                  <Trophy className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Spent</p>
                    <p className="text-3xl font-bold text-yellow-400">₹{totalSpent}L</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-yellow-400" />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Avg Price</p>
                    <p className="text-3xl font-bold text-purple-400">₹{Math.round(averagePrice)}L</p>
                  </div>
                  <Target className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Current Auction Status */}
            {auctionStarted && currentPlayer && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Current Auction Status
                </h3>
                <div className="flex items-center space-x-6">
                  <img
                    src={currentPlayer.image}
                    alt={currentPlayer.name}
                    className="w-16 h-16 rounded-full border-2 border-white/30"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${currentPlayer.name}&background=6366f1&color=fff&size=64`;
                    }}
                  />
                  <div>
                    <h4 className="text-xl font-bold text-white">{currentPlayer.name}</h4>
                    <p className="text-gray-300">{currentPlayer.role} • {currentPlayer.nationality}</p>
                  </div>
                  <div className="ml-auto">
                    <p className="text-gray-400 text-sm">Base Price</p>
                    <p className="text-2xl font-bold text-yellow-400">₹{currentPlayer.basePrice}L</p>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                <h3 className="text-white font-semibold mb-4">Recently Sold Players</h3>
                <div className="space-y-3">
                  {soldPlayers.slice(-5).reverse().map((player) => {
                    const team = teams.find(t => t.id === player.teamId);
                    return (
                      <div key={player.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <div className="flex items-center">
                          <img
                            src={player.image}
                            alt={player.name}
                            className="w-10 h-10 rounded-full mr-3"
                            onError={(e) => {
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${player.name}&background=6366f1&color=fff&size=40`;
                            }}
                          />
                          <div>
                            <p className="text-white font-medium">{player.name}</p>
                            <p className="text-gray-400 text-sm">{team?.name}</p>
                          </div>
                        </div>
                        <span className="text-green-400 font-bold">₹{player.price}L</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                <h3 className="text-white font-semibold mb-4">Team Spending Summary</h3>
                <div className="space-y-3">
                  {teams
                    .map(team => ({
                      ...team,
                      spent: 1000 - team.purse,
                      soldPlayers: players.filter(p => p.teamId === team.id && p.sold).length
                    }))
                    .sort((a, b) => b.spent - a.spent)
                    .slice(0, 5)
                    .map((team) => (
                      <div key={team.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <div className="flex items-center">
                          <img
                            src={team.logo}
                            alt={team.name}
                            className="w-8 h-8 mr-3"
                            onError={(e) => {
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${team.shortName}&background=${team.color.slice(1)}&color=fff&size=32`;
                            }}
                          />
                          <div>
                            <p className="text-white font-medium">{team.shortName}</p>
                            <p className="text-gray-400 text-sm">{team.soldPlayers} players</p>
                          </div>
                        </div>
                        <span className="text-yellow-400 font-bold">₹{team.spent}L</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bidding Tab */}
        {activeTab === 'bidding' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Target className="w-6 h-6 mr-2" />
                Bidding Management
              </h2>

              {/* Player Selection for Bidding */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Select Player to Bid On</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {players.filter(p => !p.sold).map(player => (
                      <button
                        key={player.id}
                        onClick={() => {
                          setSelectedPlayerForBid(player);
                          setBidAmount(player.basePrice);
                          setCurrentPlayer(player); // Sync to presenter display
                        }}
                        className={`w-full flex items-center p-4 rounded-lg border transition-all ${
                          selectedPlayerForBid?.id === player.id
                            ? 'bg-blue-500/20 border-blue-400'
                            : 'bg-white/5 border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <img
                          src={player.image}
                          alt={player.name}
                          className="w-12 h-12 rounded-full mr-3"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${player.name}&background=6366f1&color=fff&size=48`;
                          }}
                        />
                        <div className="text-left flex-1">
                          <p className="text-white font-medium">{player.name}</p>
                          <p className="text-gray-400 text-sm">{player.role} • Base: ₹{player.basePrice}L</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bidding Controls */}
                {selectedPlayerForBid && (
                  <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-400/30">
                    <h3 className="text-lg font-semibold text-white mb-4">Place Bid</h3>
                    
                    <div className="space-y-4">
                      {/* Player Info */}
                      <div className="bg-white/10 rounded-lg p-4">
                        <img
                          src={selectedPlayerForBid.image}
                          alt={selectedPlayerForBid.name}
                          className="w-16 h-16 rounded-full mb-2 mx-auto"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${selectedPlayerForBid.name}&background=6366f1&color=fff&size=64`;
                          }}
                        />
                        <h4 className="text-xl font-bold text-white text-center">{selectedPlayerForBid.name}</h4>
                        <p className="text-gray-300 text-center">{selectedPlayerForBid.role}</p>
                        <p className="text-yellow-400 text-center font-bold mt-2">Base: ₹{selectedPlayerForBid.basePrice}L</p>
                        {currentBid > 0 && (
                          <p className="text-green-400 text-center font-bold mt-1">Current Bid: ₹{currentBid}L</p>
                        )}
                      </div>

                      {/* Bid Amount with IPL Increment Logic */}
                      <div>
                        <label className="block text-white mb-3 font-medium text-lg">
                          💰 Place Your Bid
                        </label>

                        {/* Quick Bid Buttons */}
                        <div className="mb-4">
                          <p className="text-gray-300 text-sm mb-2 font-medium">Quick Bids (Click to bid):</p>
                          <div className="grid grid-cols-4 gap-2">
                            {(() => {
                              const quickBids = [];
                              let currentBid = Math.max(selectedPlayerForBid.basePrice, bidAmount);
                              
                              // Generate 8 quick bid options
                              for (let i = 0; i < 8; i++) {
                                if (i === 0 && currentBid === bidAmount) {
                                  quickBids.push(currentBid);
                                } else {
                                  const nextIncrement = getNextBidIncrement(currentBid);
                                  currentBid = currentBid + nextIncrement;
                                  quickBids.push(currentBid);
                                }
                              }
                              
                              return quickBids.map((amount, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    setBidAmount(amount);
                                    // Broadcast just the bid amount, no team association yet
                                    updateBidDisplay(amount, 0); // 0 = no team assigned
                                  }}
                                  className={`px-3 py-2 rounded-lg font-bold text-sm transition-all ${
                                    bidAmount === amount
                                      ? 'bg-yellow-500 text-black shadow-lg scale-105'
                                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
                                  }`}
                                >
                                  ₹{amount}L
                                </button>
                              ));
                            })()}
                          </div>
                          <p className="text-gray-400 text-xs mt-2">
                            {bidAmount < 100 && '💡 Increment: +₹5L per step'}
                            {bidAmount >= 100 && bidAmount < 200 && '💡 Increment: +₹10L per step'}
                            {bidAmount >= 200 && bidAmount < 500 && '💡 Increment: +₹20L per step'}
                            {bidAmount >= 500 && bidAmount < 1000 && '💡 Increment: +₹25L per step'}
                            {bidAmount >= 1000 && '💡 Increment: +₹50L per step'}
                          </p>
                        </div>

                        {/* Manual Input Option */}
                        <div>
                          <p className="text-gray-300 text-sm mb-2 font-medium">Manual Bid:</p>
                          <div className="flex items-center gap-2">
                            {/* Decrement Button */}
                            <button
                              onClick={() => {
                                const increment = getNextBidIncrement(bidAmount - 1);
                                const newAmount = Math.max(selectedPlayerForBid.basePrice, bidAmount - increment);
                                setBidAmount(newAmount);
                                updateBidDisplay(newAmount, 0); // 0 = no team
                              }}
                              disabled={bidAmount <= selectedPlayerForBid.basePrice}
                              className="px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-bold text-xl transition-colors"
                            >
                              -
                            </button>
                            
                            {/* Manual Input Field */}
                            <input
                              type="number"
                              value={bidAmount}
                              onChange={(e) => {
                                const newAmount = Number(e.target.value);
                                setBidAmount(newAmount);
                                updateBidDisplay(newAmount, 0); // 0 = no team
                              }}
                              min={selectedPlayerForBid.basePrice}
                              placeholder="Enter amount"
                              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            
                            {/* Increment Button */}
                            <button
                              onClick={() => {
                                const increment = getNextBidIncrement(bidAmount);
                                const newAmount = bidAmount + increment;
                                setBidAmount(newAmount);
                                updateBidDisplay(newAmount, 0); // 0 = no team
                              }}
                              className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-xl transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-gray-400 text-xs mt-1">
                            Min: ₹{selectedPlayerForBid.basePrice}L | Next: +₹{getNextBidIncrement(bidAmount)}L
                          </p>
                        </div>
                      </div>

                      {/* Mark as Sold Button */}
                      <button
                        onClick={() => setShowSoldModal(true)}
                        disabled={bidAmount < selectedPlayerForBid.basePrice}
                        className="w-full flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                      >
                        <Trophy className="w-5 h-5 mr-2" />
                        Mark as SOLD
                      </button>

                      {/* Mark as Unsold Button */}
                      <button
                        onClick={() => {
                          markUnsold(selectedPlayerForBid.id);
                          setSelectedPlayerForBid(null);
                          setBidAmount(0);
                        }}
                        className="w-full flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                      >
                        <X className="w-5 h-5 mr-2" />
                        Mark as Unsold
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sold Players List */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Sold Players</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {players.filter(p => p.sold && p.teamId).map(player => {
                    const team = teams.find(t => t.id === player.teamId);
                    return (
                      <div key={player.id} className="bg-white/5 rounded-lg p-4 border border-white/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img
                              src={player.image}
                              alt={player.name}
                              className="w-12 h-12 rounded-full mr-3"
                              onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${player.name}&background=6366f1&color=fff&size=48`;
                              }}
                            />
                            <div>
                              <p className="text-white font-medium">{player.name}</p>
                              <p className="text-gray-400 text-sm">{player.role}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-green-400 font-bold">₹{player.price}L</p>
                            {team && (
                              <div className="flex items-center mt-1">
                                <img src={team.logo} alt={team.name} className="w-4 h-4 mr-1" />
                                <p className="text-gray-300 text-sm">{team.shortName}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Players Tab - Comprehensive CMS */}
        {activeTab === 'players' && (
          <div className="space-y-6">
            {/* Header with Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Player Management CMS</h2>
                <p className="text-gray-400">Manage all player data, stats, and auction details</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleExportPlayers}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Player
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search players..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2 bg-gray-800 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer hover:border-white/50 transition-colors"
                >
                  <option value="all" className="bg-gray-900 text-white">All Roles</option>
                  <option value="Batsman" className="bg-gray-900 text-white">Batsman</option>
                  <option value="Bowler" className="bg-gray-900 text-white">Bowler</option>
                  <option value="All-rounder" className="bg-gray-900 text-white">All-rounder</option>
                  <option value="Wicketkeeper" className="bg-gray-900 text-white">Wicketkeeper</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-gray-800 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer hover:border-white/50 transition-colors"
                >
                  <option value="all" className="bg-gray-900 text-white">All Status</option>
                  <option value="available" className="bg-gray-900 text-white">Available</option>
                  <option value="sold" className="bg-gray-900 text-white">Sold</option>
                </select>
                <div className="text-sm text-gray-400 flex items-center">
                  {filteredPlayers.length} of {players.length} players
                </div>
              </div>
            </div>

            {/* Players Table */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Player</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stats</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Base Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredPlayers.map((player) => {
                      const team = teams.find(t => t.id === player.teamId);
                      return (
                        <tr key={player.id} className="hover:bg-white/5">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={player.image}
                                alt={player.name}
                                className="w-10 h-10 rounded-full mr-3 object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${player.name}&background=6366f1&color=fff&size=40`;
                                }}
                              />
                              <div>
                                <p className="text-white font-medium">{player.name}</p>
                                <p className="text-gray-400 text-sm">{player.nationality}, {player.age}y</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 bg-white/10 text-white text-xs rounded-full">
                              {player.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            <div className="space-y-1">
                              {player.stats?.matches && <div>M: {player.stats.matches}</div>}
                              {player.stats?.runs && <div>R: {player.stats.runs}</div>}
                              {player.stats?.wickets && <div>W: {player.stats.wickets}</div>}
                              {player.stats?.strikeRate && <div>SR: {player.stats.strikeRate}</div>}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-white font-bold">₹{player.basePrice}L</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              player.sold
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-600 text-gray-300'
                            }`}>
                              {player.sold ? 'Sold' : 'Available'}
                            </span>
                            {player.sold && team && (
                              <div className="text-xs text-gray-400 mt-1">to {team.shortName}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditPlayer(player)}
                                className="text-blue-400 hover:text-blue-300 p-1"
                                title="Edit Player"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePlayer(player.id)}
                                className="text-red-400 hover:text-red-300 p-1"
                                title="Delete Player"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filteredPlayers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No players found matching your criteria</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add/Edit Player Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-white/20">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">
                    {showAddModal ? 'Add New Player' : 'Edit Player'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      setEditingPlayer(null);
                      setNewPlayer({
                        name: '',
                        role: 'Batsman',
                        basePrice: 50,
                        nationality: 'India',
                        age: 25,
                        battingStyle: 'Right-handed',
                        bowlingStyle: '',
                        image: '',
                        stats: {
                          matches: 0,
                          runs: 0,
                          wickets: 0,
                          average: 0,
                          strikeRate: 0
                        }
                      });
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Player Name *</label>
                    <input
                      type="text"
                      value={newPlayer.name}
                      onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Enter player name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Role *</label>
                    <select
                      value={newPlayer.role}
                      onChange={(e) => setNewPlayer({...newPlayer, role: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-800 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer hover:border-white/50 transition-colors"
                    >
                      <option value="Batsman" className="bg-gray-900 text-white">Batsman</option>
                      <option value="Bowler" className="bg-gray-900 text-white">Bowler</option>
                      <option value="All-rounder" className="bg-gray-900 text-white">All-rounder</option>
                      <option value="Wicketkeeper" className="bg-gray-900 text-white">Wicketkeeper</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Base Price (Lakhs) *</label>
                    <input
                      type="number"
                      value={newPlayer.basePrice}
                      onChange={(e) => setNewPlayer({...newPlayer, basePrice: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="50"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nationality *</label>
                    <input
                      type="text"
                      value={newPlayer.nationality}
                      onChange={(e) => setNewPlayer({...newPlayer, nationality: e.target.value})}
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="India"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Age *</label>
                    <input
                      type="number"
                      value={newPlayer.age}
                      onChange={(e) => setNewPlayer({...newPlayer, age: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="25"
                      min="16"
                      max="50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                    <input
                      type="url"
                      value={newPlayer.image}
                      onChange={(e) => setNewPlayer({...newPlayer, image: e.target.value})}
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="https://example.com/player-image.jpg"
                    />
                  </div>
                </div>

                {/* Batting/Bowling Styles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Batting Style</label>
                    <select
                      value={newPlayer.battingStyle}
                      onChange={(e) => setNewPlayer({...newPlayer, battingStyle: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-800 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer hover:border-white/50 transition-colors"
                    >
                      <option value="Right-handed" className="bg-gray-900 text-white">Right-handed</option>
                      <option value="Left-handed" className="bg-gray-900 text-white">Left-handed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bowling Style</label>
                    <select
                      value={newPlayer.bowlingStyle}
                      onChange={(e) => setNewPlayer({...newPlayer, bowlingStyle: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-800 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer hover:border-white/50 transition-colors"
                    >
                      <option value="" className="bg-gray-900 text-white">None</option>
                      <option value="Right-arm fast" className="bg-gray-900 text-white">Right-arm fast</option>
                      <option value="Left-arm fast" className="bg-gray-900 text-white">Left-arm fast</option>
                      <option value="Right-arm medium" className="bg-gray-900 text-white">Right-arm medium</option>
                      <option value="Left-arm medium" className="bg-gray-900 text-white">Left-arm medium</option>
                      <option value="Right-arm off-spin" className="bg-gray-900 text-white">Right-arm off-spin</option>
                      <option value="Left-arm off-spin" className="bg-gray-900 text-white">Left-arm off-spin</option>
                      <option value="Right-arm leg-spin" className="bg-gray-900 text-white">Right-arm leg-spin</option>
                      <option value="Left-arm leg-spin" className="bg-gray-900 text-white">Left-arm leg-spin</option>
                    </select>
                  </div>
                </div>

                {/* Statistics */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Player Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Matches</label>
                      <input
                        type="number"
                        value={newPlayer.stats?.matches || 0}
                        onChange={(e) => setNewPlayer({
                          ...newPlayer,
                          stats: {...newPlayer.stats, matches: parseInt(e.target.value) || 0}
                        })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Runs</label>
                      <input
                        type="number"
                        value={newPlayer.stats?.runs || 0}
                        onChange={(e) => setNewPlayer({
                          ...newPlayer,
                          stats: {...newPlayer.stats, runs: parseInt(e.target.value) || 0}
                        })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Wickets</label>
                      <input
                        type="number"
                        value={newPlayer.stats?.wickets || 0}
                        onChange={(e) => setNewPlayer({
                          ...newPlayer,
                          stats: {...newPlayer.stats, wickets: parseInt(e.target.value) || 0}
                        })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Average</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newPlayer.stats?.average || 0}
                        onChange={(e) => setNewPlayer({
                          ...newPlayer,
                          stats: {...newPlayer.stats, average: parseFloat(e.target.value) || 0}
                        })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Strike Rate</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newPlayer.stats?.strikeRate || 0}
                        onChange={(e) => setNewPlayer({
                          ...newPlayer,
                          stats: {...newPlayer.stats, strikeRate: parseFloat(e.target.value) || 0}
                        })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-white/20">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      setEditingPlayer(null);
                      setNewPlayer({
                        name: '',
                        role: 'Batsman',
                        basePrice: 50,
                        nationality: 'India',
                        age: 25,
                        battingStyle: 'Right-handed',
                        bowlingStyle: '',
                        image: '',
                        stats: {
                          matches: 0,
                          runs: 0,
                          wickets: 0,
                          average: 0,
                          strikeRate: 0
                        }
                      });
                    }}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (showAddModal) {
                        // Add new player
                        if (newPlayer.name) {
                          addPlayer(newPlayer);
                          setShowAddModal(false);
                          setNewPlayer({
                            name: '',
                            role: 'Batsman',
                            basePrice: 50,
                            nationality: 'India',
                            age: 25,
                            battingStyle: 'Right-handed',
                            bowlingStyle: '',
                            image: '',
                            stats: {
                              matches: 0,
                              runs: 0,
                              wickets: 0,
                              average: 0,
                              strikeRate: 0
                            }
                          });
                        }
                      } else {
                        // Update existing player
                        handleUpdatePlayer();
                      }
                    }}
                    disabled={!newPlayer.name.trim()}
                    className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {showAddModal ? 'Add Player' : 'Update Player'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Teams Tab */}
        {activeTab === 'teams' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teams.map((team) => {
              const teamPlayers = players.filter(p => p.teamId === team.id && p.sold);
              const totalSpent = 12000 - team.purse;
              
              return (
                <div key={team.id} className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
                  <div className="p-6" style={{ backgroundColor: `${team.color}20` }}>
                    <div className="flex items-center mb-4">
                      <img
                        src={team.logo}
                        alt={team.name}
                        className="w-12 h-12 mr-3"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${team.shortName}&background=${team.color.slice(1)}&color=fff&size=48`;
                        }}
                      />
                      <div>
                        <h3 className="text-white font-bold">{team.shortName}</h3>
                        <p className="text-gray-300 text-sm">{team.name}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Players</span>
                        <span className="text-white font-bold">{teamPlayers.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Remaining</span>
                        <span className="text-green-400 font-bold">₹{team.purse}L</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Spent</span>
                        <span className="text-yellow-400 font-bold">₹{totalSpent}L</span>
                      </div>
                      
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${(totalSpent / 12000) * 100}%`,
                            backgroundColor: team.color
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {teamPlayers.length > 0 && (
                    <div className="p-4 border-t border-white/10">
                      <h4 className="text-white font-medium mb-2">Squad</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {teamPlayers.map((player) => (
                          <div key={player.id} className="flex items-center justify-between text-sm">
                            <span className="text-gray-300">{player.name}</span>
                            <span className="text-yellow-400">₹{player.price}L</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Auction Controls
              </h3>
              <div className="space-y-4">
                <button
                  onClick={resetAuction}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Reset Auction
                </button>
                <p className="text-gray-400 text-sm">
                  This will reset all auction data including player sales and team purses.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sold Modal - Team Selection (Compact) */}
      {showSoldModal && selectedPlayerForBid && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl border border-white/30 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 sticky top-0 bg-slate-900/95">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                Select Winning Team
              </h3>
              <button
                onClick={() => setShowSoldModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              {/* Player Info - Compact */}
              <div className="bg-white/5 rounded-lg p-3 mb-5 text-center border border-white/10">
                <img
                  src={selectedPlayerForBid.image}
                  alt={selectedPlayerForBid.name}
                  className="w-14 h-14 rounded-full mx-auto mb-2 border-2 border-yellow-400"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${selectedPlayerForBid.name}&background=6366f1&color=fff&size=56`;
                  }}
                />
                <h4 className="text-base font-bold text-white">{selectedPlayerForBid.name}</h4>
                <p className="text-gray-400 text-xs">{selectedPlayerForBid.role}</p>
                <p className="text-yellow-400 font-bold text-lg mt-2">₹{bidAmount}L</p>
              </div>

              {/* Team Selection - Grid */}
              <div className="mb-5">
                <label className="block text-white mb-2 font-semibold text-sm">Winning Team:</label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {teams.map(team => (
                    <button
                      key={team.id}
                      onClick={() => setSelectedTeamId(team.id)}
                      disabled={team.purse < bidAmount}
                      title={team.purse < bidAmount ? `Insufficient purse (needs ₹${bidAmount}L, has ₹${team.purse}L)` : team.name}
                      className={`p-2 rounded-lg border-2 transition-all text-center transform ${
                        selectedTeamId === team.id
                          ? 'border-yellow-400 bg-yellow-500/30 scale-105 shadow-lg shadow-yellow-400/50'
                          : team.purse < bidAmount
                          ? 'border-gray-600 bg-gray-800/40 opacity-50 cursor-not-allowed'
                          : 'border-white/30 bg-white/5 hover:bg-white/10 hover:border-white/50 hover:scale-105'
                      }`}
                    >
                      <img
                        src={team.logo}
                        alt={team.name}
                        className="w-10 h-10 mx-auto mb-1 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${team.shortName}&background=${team.color?.slice(1) || '6366f1'}&color=fff&size=40`;
                        }}
                      />
                      <p className="text-xs font-bold text-white">{team.shortName}</p>
                      <p className={`text-xs font-semibold mt-0.5 ${team.purse >= bidAmount ? 'text-green-400' : 'text-red-400'}`}>
                        ₹{team.purse}L
                      </p>
                      {selectedTeamId === team.id && (
                        <div className="text-yellow-400 text-xl font-bold">✓</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={() => {
                  if (selectedTeamId) {
                    const team = teams.find(t => t.id === selectedTeamId);
                    markSold(selectedPlayerForBid.id, selectedTeamId, bidAmount);
                    
                    localStorage.setItem('soldConfirmation', JSON.stringify({
                      playerName: selectedPlayerForBid.name,
                      playerImage: selectedPlayerForBid.image,
                      teamName: team?.name,
                      teamLogo: team?.logo,
                      price: bidAmount,
                      timestamp: Date.now()
                    }));
                    
                    setShowSoldModal(false);
                    setSelectedPlayerForBid(null);
                    setBidAmount(0);
                    setSelectedTeamId(null);
                  }
                }}
                disabled={!selectedTeamId}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-bold text-sm transition-colors"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Confirm Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
