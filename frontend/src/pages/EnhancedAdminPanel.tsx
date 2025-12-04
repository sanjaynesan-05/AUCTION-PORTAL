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
  Star
} from 'lucide-react';

export default function AdminPanel() {
  const { username, logout } = useRole();
  const navigate = useNavigate();
  const {
    players,
    teams,
    auctionStarted,
    currentPlayer,
    resetAuction,
    addPlayer,
    removePlayer,
    updateTeamPurse,
  } = useAuctionSync();

  const [activeTab, setActiveTab] = useState('overview');
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    role: 'Batsman',
    basePrice: 50,
    nationality: 'India',
    age: 25,
    battingStyle: 'Right-handed',
    bowlingStyle: '',
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddPlayer = async () => {
    if (newPlayer.name) {
      await addPlayer({
        ...newPlayer,
        sold: false,
        image: `https://ui-avatars.com/api/?name=${newPlayer.name}&background=6366f1&color=fff&size=128`,
        stats: { matches: 0, runs: 0, wickets: 0, average: 0, strikeRate: 0 }
      });
      setNewPlayer({
        name: '',
        role: 'Batsman',
        basePrice: 50,
        nationality: 'India',
        age: 25,
        battingStyle: 'Right-handed',
        bowlingStyle: '',
      });
    }
  };

  const soldPlayers = players.filter(p => p.sold);
  const totalSpent = soldPlayers.reduce((sum, p) => sum + (p.price || 0), 0);
  const averagePrice = soldPlayers.length > 0 ? totalSpent / soldPlayers.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">IPL Auction Portal</h1>
                <p className="text-sm text-gray-300">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-300">Administrator</p>
                <p className="text-white font-medium">{username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-1 flex space-x-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'players', label: 'Players', icon: Users },
              { id: 'teams', label: 'Teams', icon: Trophy },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
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

        {/* Players Tab */}
        {activeTab === 'players' && (
          <div className="space-y-6">
            {/* Add Player Form */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Add New Player
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <input
                  type="text"
                  placeholder="Player Name"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
                  className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <select
                  value={newPlayer.role}
                  onChange={(e) => setNewPlayer({...newPlayer, role: e.target.value})}
                  className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="Batsman">Batsman</option>
                  <option value="Bowler">Bowler</option>
                  <option value="All-rounder">All-rounder</option>
                  <option value="Wicketkeeper">Wicketkeeper</option>
                </select>
                <input
                  type="number"
                  placeholder="Base Price"
                  value={newPlayer.basePrice}
                  onChange={(e) => setNewPlayer({...newPlayer, basePrice: parseInt(e.target.value)})}
                  className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <input
                  type="text"
                  placeholder="Nationality"
                  value={newPlayer.nationality}
                  onChange={(e) => setNewPlayer({...newPlayer, nationality: e.target.value})}
                  className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  onClick={handleAddPlayer}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Add Player
                </button>
              </div>
            </div>

            {/* Players List */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
              <div className="p-6 border-b border-white/20">
                <h3 className="text-white font-semibold">All Players ({players.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Player</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Base Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Team</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {players.map((player) => {
                      const team = teams.find(t => t.id === player.teamId);
                      return (
                        <tr key={player.id} className="hover:bg-white/5">
                          <td className="px-6 py-4 whitespace-nowrap">
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
                                <p className="text-gray-400 text-sm">{player.nationality}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 bg-white/10 text-white text-xs rounded-full">
                              {player.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-white">₹{player.basePrice}L</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              player.sold 
                                ? 'bg-green-600 text-white' 
                                : 'bg-gray-600 text-gray-300'
                            }`}>
                              {player.sold ? 'Sold' : 'Available'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-white">
                            {team ? team.shortName : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button className="text-blue-400 hover:text-blue-300 p-1">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => removePlayer(player.id)}
                                className="text-red-400 hover:text-red-300 p-1"
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
    </div>
  );
}