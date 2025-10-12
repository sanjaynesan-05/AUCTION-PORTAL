import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useAuctionStore } from '../store/useAuctionStore';
import {
  LogOut,
  Users,
  DollarSign,
  TrendingUp,
  RefreshCw,
  UserPlus,
  Trash2,
  BarChart3,
  Crown,
} from 'lucide-react';

export default function AdminPanel() {
  const { username, logout } = useRole();
  const navigate = useNavigate();
  const { players, teams, resetAuction, addPlayer, removePlayer } = useAuctionStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'players' | 'teams'>('overview');
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    role: 'Batsman',
    basePrice: 100,
    nationality: 'India',
    age: 25,
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleResetAuction = () => {
    if (window.confirm('Are you sure you want to reset the entire auction? This cannot be undone.')) {
      resetAuction();
    }
  };

  const handleAddPlayer = () => {
    if (newPlayer.name && newPlayer.basePrice > 0) {
      addPlayer({
        ...newPlayer,
        sold: false,
      });
      setNewPlayer({
        name: '',
        role: 'Batsman',
        basePrice: 100,
        nationality: 'India',
        age: 25,
      });
      setShowAddPlayer(false);
    }
  };

  const soldPlayers = players.filter(p => p.sold && p.teamId);
  const unsoldPlayers = players.filter(p => p.sold && !p.teamId);
  const remainingPlayers = players.filter(p => !p.sold);
  const totalMoneySpent = soldPlayers.reduce((sum, p) => sum + (p.price || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="bg-slate-800/50 border-b border-slate-700 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8 text-amber-400" />
              <div>
                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                <p className="text-xs text-slate-400">Welcome, {username}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-white opacity-80" />
              <span className="text-3xl font-bold text-white">{players.length}</span>
            </div>
            <p className="text-blue-100 font-medium">Total Players</p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-white opacity-80" />
              <span className="text-3xl font-bold text-white">{soldPlayers.length}</span>
            </div>
            <p className="text-green-100 font-medium">Players Sold</p>
          </div>

          <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-white opacity-80" />
              <span className="text-3xl font-bold text-white">{totalMoneySpent}L</span>
            </div>
            <p className="text-amber-100 font-medium">Total Spent</p>
          </div>

          <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-8 h-8 text-white opacity-80" />
              <span className="text-3xl font-bold text-white">{remainingPlayers.length}</span>
            </div>
            <p className="text-slate-100 font-medium">Remaining</p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden mb-6">
          <div className="border-b border-slate-700">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-medium transition ${
                  activeTab === 'overview'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('players')}
                className={`px-6 py-4 font-medium transition ${
                  activeTab === 'players'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Players
              </button>
              <button
                onClick={() => setActiveTab('teams')}
                className={`px-6 py-4 font-medium transition ${
                  activeTab === 'teams'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Teams
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Auction Controls</h2>
                  <button
                    onClick={handleResetAuction}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset Auction
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Auction Status</h3>
                    <div className="space-y-2 text-slate-300">
                      <div className="flex justify-between">
                        <span>Sold Players:</span>
                        <span className="font-semibold text-green-400">{soldPlayers.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Unsold Players:</span>
                        <span className="font-semibold text-red-400">{unsoldPlayers.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Remaining:</span>
                        <span className="font-semibold text-blue-400">{remainingPlayers.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Top Teams by Spending</h3>
                    <div className="space-y-2">
                      {teams
                        .sort((a, b) => (1000 - a.purse) - (1000 - b.purse))
                        .slice(0, 5)
                        .map(team => (
                          <div key={team.id} className="flex justify-between text-slate-300">
                            <span className="truncate">{team.shortName}</span>
                            <span className="font-semibold text-amber-400">
                              {1000 - team.purse}L
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'players' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Player Management</h2>
                  <button
                    onClick={() => setShowAddPlayer(!showAddPlayer)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add Player
                  </button>
                </div>

                {showAddPlayer && (
                  <div className="bg-slate-700 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Add New Player</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Player Name"
                        value={newPlayer.name}
                        onChange={e => setNewPlayer({ ...newPlayer, name: e.target.value })}
                        className="px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:border-blue-500 focus:outline-none"
                      />
                      <select
                        value={newPlayer.role}
                        onChange={e => setNewPlayer({ ...newPlayer, role: e.target.value })}
                        className="px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:border-blue-500 focus:outline-none"
                      >
                        <option>Batsman</option>
                        <option>Bowler</option>
                        <option>All-rounder</option>
                        <option>Wicketkeeper</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Base Price"
                        value={newPlayer.basePrice}
                        onChange={e => setNewPlayer({ ...newPlayer, basePrice: Number(e.target.value) })}
                        className="px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:border-blue-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Nationality"
                        value={newPlayer.nationality}
                        onChange={e => setNewPlayer({ ...newPlayer, nationality: e.target.value })}
                        className="px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:border-blue-500 focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Age"
                        value={newPlayer.age}
                        onChange={e => setNewPlayer({ ...newPlayer, age: Number(e.target.value) })}
                        className="px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={handleAddPlayer}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                      >
                        Add Player
                      </button>
                      <button
                        onClick={() => setShowAddPlayer(false)}
                        className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Base Price</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Team</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.map(player => {
                        const team = teams.find(t => t.id === player.teamId);
                        return (
                          <tr key={player.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                            <td className="px-4 py-3 text-white">{player.name}</td>
                            <td className="px-4 py-3 text-slate-300">{player.role}</td>
                            <td className="px-4 py-3 text-slate-300">{player.basePrice}L</td>
                            <td className="px-4 py-3">
                              {player.sold ? (
                                player.teamId ? (
                                  <span className="px-2 py-1 bg-green-900/50 text-green-400 rounded text-xs">
                                    Sold - {player.price}L
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 bg-red-900/50 text-red-400 rounded text-xs">
                                    Unsold
                                  </span>
                                )
                              ) : (
                                <span className="px-2 py-1 bg-blue-900/50 text-blue-400 rounded text-xs">
                                  Available
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-slate-300">
                              {team ? team.shortName : '-'}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => removePlayer(player.id)}
                                className="text-red-400 hover:text-red-300 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'teams' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Team Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {teams.map(team => {
                    const teamPlayers = players.filter(p => p.teamId === team.id);
                    const spent = 1000 - team.purse;
                    return (
                      <div key={team.id} className="bg-slate-700 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white">{team.name}</h3>
                            <p className="text-sm text-slate-400">{team.shortName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-amber-400">{team.purse}L</p>
                            <p className="text-xs text-slate-400">Remaining</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-slate-300">
                            <span>Players:</span>
                            <span className="font-semibold">{teamPlayers.length}</span>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span>Spent:</span>
                            <span className="font-semibold text-green-400">{spent}L</span>
                          </div>
                          <div className="mt-3 pt-3 border-t border-slate-600">
                            <p className="text-xs text-slate-400 mb-2">Players:</p>
                            {teamPlayers.length > 0 ? (
                              <div className="space-y-1">
                                {teamPlayers.map(player => (
                                  <div key={player.id} className="flex justify-between text-xs">
                                    <span className="text-slate-300">{player.name}</span>
                                    <span className="text-amber-400">{player.price}L</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-500 italic">No players yet</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
