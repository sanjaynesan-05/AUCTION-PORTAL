/**
 * Enhanced Admin Panel - Complete Auction Control Center
 * 
 * Features:
 * - Teams Tab: View all teams with purse, players count, etc.
 * - Players Tab: View/Edit all players with CMS capabilities
 * - Auction Control: Place common bids, assign to team at end
 * - Analytics: Track sold players, revenues, statistics
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import axios from 'axios';
import {
  Users,
  Trophy,
  Gavel,
  BarChart3,
  Edit,
  Save,
  X,
  Plus,
  TrendingUp,
  DollarSign,
  LogOut,
  Play,
  Check
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Player {
  id: number;
  name: string;
  role: string;
  basePrice: number;
  status: 'PENDING' | 'SOLD' | 'UNSOLD';
  soldPrice?: number;
  soldToTeamId?: number;
  nationality: string;
  age: number;
  image: string;
  battingStyle?: string;
  bowlingStyle?: string;
}

interface Team {
  id: number;
  name: string;
  color: string;
  logo?: string;
  purse: number;
}

interface AuctionState {
  status: 'IDLE' | 'LIVE' | 'SOLD';
  currentBid: number;
  currentPlayer: Player | null;
  winningTeam: Team | null;
}

interface Analytics {
  totalPlayers: number;
  soldPlayers: number;
  unsoldPlayers: number;
  totalRevenue: number;
  avgSoldPrice: number;
  highestBid: { player: string; price: number } | null;
}

type TabType = 'teams' | 'players' | 'auction' | 'analytics';

export default function EnhancedAdminPanel() {
  const { user, logout } = useRole();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<TabType>('auction');
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [auctionState, setAuctionState] = useState<AuctionState>({
    status: 'IDLE',
    currentBid: 0,
    currentPlayer: null,
    winningTeam: null
  });
  const [analytics, setAnalytics] = useState<Analytics>({
    totalPlayers: 0,
    soldPlayers: 0,
    unsoldPlayers: 0,
    totalRevenue: 0,
    avgSoldPrice: 0,
    highestBid: null
  });
  
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Common bidding state
  const [currentBid, setCurrentBid] = useState(0);
  const [selectedTeamForFinal, setSelectedTeamForFinal] = useState<number | null>(null);

  // Get auth header
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  };

  // Load all data
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [teamsRes, playersRes, stateRes] = await Promise.all([
        axios.get(`${API_URL}/auction/teams`),
        axios.get(`${API_URL}/auction/players`),
        axios.get(`${API_URL}/auction/state`)
      ]);
      
      setTeams(teamsRes.data);
      setPlayers(playersRes.data);
      setAuctionState(stateRes.data);
      
      // Calculate analytics
      const sold = playersRes.data.filter((p: Player) => p.status === 'SOLD');
      const unsold = playersRes.data.filter((p: Player) => p.status === 'UNSOLD');
      const totalRevenue = sold.reduce((sum: number, p: Player) => sum + (p.soldPrice || 0), 0);
      const highest = sold.reduce((max: Player | null, p: Player) => 
        (!max || (p.soldPrice || 0) > (max.soldPrice || 0)) ? p : max
      , null);
      
      setAnalytics({
        totalPlayers: playersRes.data.length,
        soldPlayers: sold.length,
        unsoldPlayers: unsold.length,
        totalRevenue,
        avgSoldPrice: sold.length > 0 ? totalRevenue / sold.length : 0,
        highestBid: highest ? { player: highest.name, price: highest.soldPrice || 0 } : null
      });
      
      // Update current bid from state
      if (stateRes.data.currentBid) {
        setCurrentBid(stateRes.data.currentBid);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  // Auction Actions
  const handleSelectPlayer = async (playerId: number) => {
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/admin/auction/select-player`,
        { player_id: playerId },
        { headers: getAuthHeader() }
      );
      showMessage('success', 'Player selected for auction');
      await loadData();
    } catch (error: any) {
      showMessage('error', error.response?.data?.detail || 'Failed to select player');
    } finally {
      setLoading(false);
    }
  };

  const handleStartAuction = async () => {
    if (!auctionState.currentPlayer) {
      showMessage('error', 'Please select a player first');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/admin/auction/start`,
        {},
        { headers: getAuthHeader() }
      );
      setCurrentBid(auctionState.currentPlayer.basePrice);
      showMessage('success', 'Auction started');
      await loadData();
    } catch (error: any) {
      showMessage('error', error.response?.data?.detail || 'Failed to start auction');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async (amount: number) => {
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/admin/auction/increment`,
        { amount },
        { headers: getAuthHeader() }
      );
      setCurrentBid(prev => prev + amount);
      await loadData();
    } catch (error: any) {
      showMessage('error', error.response?.data?.detail || 'Failed to place bid');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizeSale = async () => {
    if (!selectedTeamForFinal) {
      showMessage('error', 'Please select a team');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/admin/auction/finalize`,
        { team_id: selectedTeamForFinal },
        { headers: getAuthHeader() }
      );
      showMessage('success', 'Player sold successfully');
      setSelectedTeamForFinal(null);
      setCurrentBid(0);
      await loadData();
    } catch (error: any) {
      showMessage('error', error.response?.data?.detail || 'Failed to finalize sale');
    } finally {
      setLoading(false);
    }
  };

  const handleNextPlayer = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/admin/auction/next`,
        {},
        { headers: getAuthHeader() }
      );
      setCurrentBid(0);
      setSelectedTeamForFinal(null);
      await loadData();
    } catch (error: any) {
      showMessage('error', error.response?.data?.detail || 'Failed to move to next player');
    } finally {
      setLoading(false);
    }
  };

  // Player CMS Actions
  const handleEditPlayer = (player: Player) => {
    setEditingPlayer({ ...player });
  };

  const handleSavePlayer = async () => {
    if (!editingPlayer) return;
    
    setLoading(true);
    try {
      await axios.put(
        `${API_URL}/admin/players/${editingPlayer.id}`,
        editingPlayer,
        { headers: getAuthHeader() }
      );
      showMessage('success', 'Player updated successfully');
      setEditingPlayer(null);
      await loadData();
    } catch (error: any) {
      showMessage('error', error.response?.data?.detail || 'Failed to update player');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">IPL Auction Control Center</h1>
                <p className="text-sm text-gray-400">Admin Panel - Full Control</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Message Toast */}
      {message && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
          message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white animate-slide-in`}>
          {message.text}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex space-x-2 bg-slate-800/50 backdrop-blur-xl p-2 rounded-xl border border-white/10">
          {[
            { id: 'auction', label: 'Auction Control', icon: Gavel },
            { id: 'teams', label: 'Teams', icon: Users },
            { id: 'players', label: 'Players CMS', icon: Trophy },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 pb-8">
        {/* Auction Control Tab */}
        {activeTab === 'auction' && (
          <div className="space-y-6">
            {/* Current Auction Status */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Current Auction</h2>
              {auctionState.currentPlayer ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <img 
                      src={auctionState.currentPlayer.image} 
                      alt={auctionState.currentPlayer.name}
                      className="w-full h-64 object-cover rounded-xl"
                      onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/400x600?text=Player'}
                    />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-white">{auctionState.currentPlayer.name}</h3>
                    <p className="text-gray-400">{auctionState.currentPlayer.role}</p>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-400">Base Price:</span>
                      <span className="text-2xl font-bold text-yellow-400">₹{auctionState.currentPlayer.basePrice}L</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-400">Current Bid:</span>
                      <span className="text-3xl font-bold text-green-400">₹{currentBid}L</span>
                    </div>
                    
                    {/* Bid Buttons */}
                    {auctionState.status === 'LIVE' && (
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Increase Bid:</p>
                        <div className="grid grid-cols-4 gap-2">
                          {[10, 25, 50, 100].map((amount) => (
                            <button
                              key={amount}
                              onClick={() => handlePlaceBid(amount)}
                              disabled={loading}
                              className="px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white rounded-lg font-bold transition-all"
                            >
                              +₹{amount}L
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Assign Team & Finalize */}
                    {auctionState.status === 'LIVE' && (
                      <div className="space-y-2">
                        <label className="block text-sm text-gray-400">Assign to Team:</label>
                        <select
                          value={selectedTeamForFinal || ''}
                          onChange={(e) => setSelectedTeamForFinal(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-white/10"
                        >
                          <option value="">Select Team</option>
                          {teams.map((team) => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                          ))}
                        </select>
                        <button
                          onClick={handleFinalizeSale}
                          disabled={!selectedTeamForFinal || loading}
                          className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded-lg font-bold transition-all flex items-center justify-center space-x-2"
                        >
                          <Check className="w-5 h-5" />
                          <span>Finalize Sale - ₹{currentBid}L</span>
                        </button>
                      </div>
                    )}
                    
                    {/* Start/Next Actions */}
                    {auctionState.status === 'IDLE' && (
                      <button
                        onClick={handleStartAuction}
                        disabled={loading}
                        className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-black rounded-lg font-bold transition-all flex items-center justify-center space-x-2"
                      >
                        <Play className="w-5 h-5" />
                        <span>Start Auction</span>
                      </button>
                    )}
                    
                    {auctionState.status === 'SOLD' && (
                      <button
                        onClick={handleNextPlayer}
                        disabled={loading}
                        className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-bold transition-all"
                      >
                        Next Player
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No player selected. Go to Players tab to select.</p>
              )}
            </div>

            {/* Pending Players Quick Select */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Pending Players - Quick Select</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {players.filter(p => p.status === 'PENDING').slice(0, 12).map((player) => (
                  <button
                    key={player.id}
                    onClick={() => handleSelectPlayer(player.id)}
                    disabled={loading}
                    className="p-3 bg-slate-700 hover:bg-slate-600 disabled:bg-gray-700 text-white rounded-lg text-sm transition-all"
                  >
                    {player.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Teams Tab */}
        {activeTab === 'teams' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => {
              const teamPlayers = players.filter(p => p.soldToTeamId === team.id && p.status === 'SOLD');
              const spent = teamPlayers.reduce((sum, p) => sum + (p.soldPrice || 0), 0);
              
              return (
                <div key={team.id} className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-full" style={{ backgroundColor: team.color }}></div>
                    <h3 className="text-xl font-bold text-white">{team.name}</h3>
                  </div>
                  <div className="space-y-2 text-gray-300">
                    <div className="flex justify-between">
                      <span>Total Purse:</span>
                      <span className="font-bold">₹{team.purse}L</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Spent:</span>
                      <span className="font-bold text-red-400">₹{spent}L</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining:</span>
                      <span className="font-bold text-green-400">₹{team.purse - spent}L</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Players:</span>
                      <span className="font-bold">{teamPlayers.length}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <h4 className="text-sm font-bold text-gray-400 mb-2">Squad:</h4>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {teamPlayers.map((player) => (
                        <div key={player.id} className="flex justify-between text-sm">
                          <span className="text-gray-300">{player.name}</span>
                          <span className="text-gray-400">₹{player.soldPrice}L</span>
                        </div>
                      ))}
                      {teamPlayers.length === 0 && (
                        <p className="text-gray-500 text-sm">No players yet</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Players CMS Tab */}
        {activeTab === 'players' && (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Players Management</h2>
              <div className="text-sm text-gray-400">
                Total: {players.length} | Sold: {analytics.soldPlayers} | Pending: {players.filter(p => p.status === 'PENDING').length}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Base Price</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Sold Price</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Team</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr key={player.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-4 py-3 text-white">{player.name}</td>
                      <td className="px-4 py-3 text-gray-300">{player.role}</td>
                      <td className="px-4 py-3 text-gray-300">₹{player.basePrice}L</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          player.status === 'SOLD' ? 'bg-green-500/20 text-green-400' :
                          player.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {player.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {player.soldPrice ? `₹${player.soldPrice}L` : '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {player.soldToTeamId ? teams.find(t => t.id === player.soldToTeamId)?.name : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleEditPlayer(player)}
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <Trophy className="w-8 h-8" />
                <span className="text-3xl font-bold">{analytics.totalPlayers}</span>
              </div>
              <p className="text-blue-100">Total Players</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <Check className="w-8 h-8" />
                <span className="text-3xl font-bold">{analytics.soldPlayers}</span>
              </div>
              <p className="text-green-100">Sold Players</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8" />
                <span className="text-3xl font-bold">₹{analytics.totalRevenue}L</span>
              </div>
              <p className="text-yellow-100">Total Revenue</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8" />
                <span className="text-3xl font-bold">₹{Math.round(analytics.avgSoldPrice)}L</span>
              </div>
              <p className="text-purple-100">Avg Sold Price</p>
            </div>
            
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <BarChart3 className="w-8 h-8" />
                <div className="text-right">
                  <p className="text-2xl font-bold">{analytics.highestBid?.player || 'N/A'}</p>
                  <p className="text-3xl font-bold">₹{analytics.highestBid?.price || 0}L</p>
                </div>
              </div>
              <p className="text-red-100">Highest Bid</p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Player Modal */}
      {editingPlayer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-slate-800">
              <h3 className="text-xl font-bold text-white">Edit Player: {editingPlayer.name}</h3>
              <button
                onClick={() => setEditingPlayer(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  value={editingPlayer.name}
                  onChange={(e) => setEditingPlayer({...editingPlayer, name: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-white/10"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Role</label>
                <input
                  type="text"
                  value={editingPlayer.role}
                  onChange={(e) => setEditingPlayer({...editingPlayer, role: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-white/10"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Base Price (Lakhs)</label>
                  <input
                    type="number"
                    value={editingPlayer.basePrice}
                    onChange={(e) => setEditingPlayer({...editingPlayer, basePrice: Number(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Age</label>
                  <input
                    type="number"
                    value={editingPlayer.age}
                    onChange={(e) => setEditingPlayer({...editingPlayer, age: Number(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-white/10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nationality</label>
                <input
                  type="text"
                  value={editingPlayer.nationality}
                  onChange={(e) => setEditingPlayer({...editingPlayer, nationality: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-white/10"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setEditingPlayer(null)}
                  className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePlayer}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded-lg font-medium transition-all flex items-center justify-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
