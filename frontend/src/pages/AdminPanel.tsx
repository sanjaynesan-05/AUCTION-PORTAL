/**
 * Admin Panel - Full Control Over Auction
 * 
 * Features:
 * - Select player from pending list
 * - Start auction at base price
 * - Increment bid (+10, +25, +50, +100)
 * - Select winning team
 * - End auction (finalize sale)
 * - Move to next player
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import axios from 'axios';
import {
  Play,
  Plus,
  Check,
  SkipForward,
  LogOut,
  Gavel,
  TrendingUp
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Player {
  id: number;
  name: string;
  role: string;
  basePrice: number;
  status: 'PENDING' | 'SOLD';
  soldPrice?: number;
  soldToTeamId?: number;
  nationality: string;
  age: number;
  image: string;
}

interface Team {
  id: number;
  name: string;
  color: string;
}

interface AuctionState {
  status: 'IDLE' | 'LIVE' | 'SOLD';
  currentBid: number;
  currentPlayer: Player | null;
  winningTeam: Team | null;
}

export default function AdminPanel() {
  const { user, logout } = useRole();
  const navigate = useNavigate();
  
  const [auctionState, setAuctionState] = useState<AuctionState>({
    status: 'IDLE',
    currentBid: 0,
    currentPlayer: null,
    winningTeam: null
  });
  
  const [pendingPlayers, setPendingPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Get auth token
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  };

  // Load initial data
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2000); // Refresh every 2s
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [stateRes, playersRes, teamsRes] = await Promise.all([
        axios.get(`${API_URL}/auction/state`),
        axios.get(`${API_URL}/auction/players`),
        axios.get(`${API_URL}/auction/teams`)
      ]);
      
      setAuctionState(stateRes.data);
      setPendingPlayers(playersRes.data.filter((p: Player) => p.status === 'PENDING'));
      setTeams(teamsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Admin Actions
  const handleSelectPlayer = async (playerId: number) => {
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/admin/auction/select-player`,
        { player_id: playerId },
        { headers: getAuthHeader() }
      );
      showMessage('success', 'Player selected');
      await loadData();
    } catch (error: any) {
      showMessage('error', error.response?.data?.detail || 'Failed to select player');
    } finally {
      setLoading(false);
    }
  };

  const handleStartAuction = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/admin/auction/start`,
        {},
        { headers: getAuthHeader() }
      );
      showMessage('success', 'Auction started');
      await loadData();
    } catch (error: any) {
      showMessage('error', error.response?.data?.detail || 'Failed to start auction');
    } finally {
      setLoading(false);
    }
  };

  const handleIncrementBid = async (amount: number) => {
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/admin/auction/increment`,
        { amount },
        { headers: getAuthHeader() }
      );
      await loadData();
    } catch (error: any) {
      showMessage('error', error.response?.data?.detail || 'Failed to increment bid');
    } finally {
      setLoading(false);
    }
  };

  const handleEndAuction = async () => {
    if (!selectedTeamId) {
      showMessage('error', 'Please select a team first');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/admin/auction/end`,
        { team_id: selectedTeamId },
        { headers: getAuthHeader() }
      );
      showMessage('success', 'Player sold!');
      setSelectedTeamId(null);
      await loadData();
    } catch (error: any) {
      showMessage('error', error.response?.data?.detail || 'Failed to end auction');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/admin/auction/next`,
        {},
        { headers: getAuthHeader() }
      );
      showMessage('success', 'Ready for next player');
      setSelectedTeamId(null);
      await loadData();
    } catch (error: any) {
      showMessage('error', error.response?.data?.detail || 'Failed to move to next');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                <Gavel className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                <p className="text-sm text-gray-300">Auction Control Center</p>
              </div>
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

      {/* Message Toast */}
      {message && (
        <div className={`fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
          message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {message.text}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Current Auction Panel */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Current Auction</h2>
            
            {auctionState.currentPlayer ? (
              <div className="space-y-6">
                {/* Player Card */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
                  <div className="flex items-center space-x-4">
                    <img
                      src={auctionState.currentPlayer.image}
                      alt={auctionState.currentPlayer.name}
                      className="w-20 h-20 rounded-full border-4 border-white object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold">{auctionState.currentPlayer.name}</h3>
                      <p className="text-purple-100">{auctionState.currentPlayer.role} • {auctionState.currentPlayer.nationality}</p>
                      <p className="text-sm text-purple-200">Base Price: ₹{auctionState.currentPlayer.basePrice}L</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                      auctionState.status === 'IDLE' ? 'bg-yellow-500' :
                      auctionState.status === 'LIVE' ? 'bg-green-500 animate-pulse' :
                      'bg-blue-500'
                    }`}>
                      {auctionState.status}
                    </div>
                  </div>
                </div>

                {/* Current Bid Display */}
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-8 text-center">
                  <p className="text-white text-sm font-semibold mb-2">CURRENT BID</p>
                  <p className="text-white text-6xl font-bold">₹{auctionState.currentBid}L</p>
                  {auctionState.winningTeam && (
                    <p className="text-white mt-4 text-lg">
                      Sold to: <span className="font-bold">{auctionState.winningTeam.name}</span>
                    </p>
                  )}
                </div>

                {/* Control Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  {auctionState.status === 'IDLE' && (
                    <button
                      onClick={handleStartAuction}
                      disabled={loading}
                      className="col-span-2 flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-bold text-lg disabled:opacity-50"
                    >
                      <Play className="w-6 h-6 mr-2" />
                      Start Auction
                    </button>
                  )}

                  {auctionState.status === 'LIVE' && (
                    <>
                      <button
                        onClick={() => handleIncrementBid(10)}
                        disabled={loading}
                        className="flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold disabled:opacity-50"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        +₹10L
                      </button>
                      <button
                        onClick={() => handleIncrementBid(25)}
                        disabled={loading}
                        className="flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold disabled:opacity-50"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        +₹25L
                      </button>
                      <button
                        onClick={() => handleIncrementBid(50)}
                        disabled={loading}
                        className="flex items-center justify-center px-6 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-bold disabled:opacity-50"
                      >
                        <TrendingUp className="w-5 h-5 mr-2" />
                        +₹50L
                      </button>
                      <button
                        onClick={() => handleIncrementBid(100)}
                        disabled={loading}
                        className="flex items-center justify-center px-6 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-bold disabled:opacity-50"
                      >
                        <TrendingUp className="w-5 h-5 mr-2" />
                        +₹100L
                      </button>
                      
                      {/* Team Selector */}
                      <div className="col-span-2 bg-white/10 rounded-xl p-4">
                        <label className="text-white text-sm font-semibold mb-2 block">Select Winning Team:</label>
                        <select
                          value={selectedTeamId || ''}
                          onChange={(e) => setSelectedTeamId(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-white/20 text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">-- Select Team --</option>
                          {teams.map(team => (
                            <option key={team.id} value={team.id} style={{ color: 'black' }}>
                              {team.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={handleEndAuction}
                        disabled={loading || !selectedTeamId}
                        className="col-span-2 flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check className="w-6 h-6 mr-2" />
                        End Auction (Finalize Sale)
                      </button>
                    </>
                  )}

                  {auctionState.status === 'SOLD' && (
                    <button
                      onClick={handleNext}
                      disabled={loading}
                      className="col-span-2 flex items-center justify-center px-6 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-bold text-lg disabled:opacity-50"
                    >
                      <SkipForward className="w-6 h-6 mr-2" />
                      Next Player
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-white">
                <p className="text-xl mb-4">No player selected</p>
                <p className="text-gray-400">Select a player from the list to start</p>
              </div>
            )}
          </div>

          {/* Pending Players List */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">Pending Players ({pendingPlayers.length})</h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {pendingPlayers.map(player => (
                <button
                  key={player.id}
                  onClick={() => handleSelectPlayer(player.id)}
                  disabled={loading || auctionState.status === 'LIVE'}
                  className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-purple-400"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={player.image}
                      alt={player.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-white font-semibold">{player.name}</p>
                      <p className="text-gray-400 text-sm">{player.role} • ₹{player.basePrice}L</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
