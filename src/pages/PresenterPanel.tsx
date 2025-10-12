import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useAuctionStore } from '../store/useAuctionStore';
import {
  LogOut,
  Play,
  Pause,
  SkipForward,
  CheckCircle,
  XCircle,
  DollarSign,
  Gavel,
  TrendingUp,
} from 'lucide-react';

export default function PresenterPanel() {
  const { username, logout } = useRole();
  const navigate = useNavigate();
  const {
    currentPlayer,
    teams,
    auctionStarted,
    auctionPaused,
    currentBid,
    currentBidder,
    bidHistory,
    startAuction,
    pauseAuction,
    resumeAuction,
    nextPlayer,
    placeBid,
    markSold,
    markUnsold,
  } = useAuctionStore();

  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [bidAmount, setBidAmount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleStartAuction = () => {
    startAuction();
  };

  const handlePlaceBid = () => {
    if (selectedTeam && bidAmount > currentBid) {
      placeBid(selectedTeam, bidAmount);
      setBidAmount(0);
      setSelectedTeam(null);
    }
  };

  const handleSold = () => {
    if (currentPlayer && currentBidder) {
      markSold(currentPlayer.id, currentBidder, currentBid);
      nextPlayer();
    }
  };

  const handleUnsold = () => {
    if (currentPlayer) {
      markUnsold(currentPlayer.id);
      nextPlayer();
    }
  };

  const currentBiddingTeam = teams.find(t => t.id === currentBidder);
  const eligibleTeams = teams.filter(t => t.purse >= (currentBid + 10));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <nav className="bg-slate-800/50 border-b border-slate-700 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Gavel className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold text-white">Presenter Panel</h1>
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
        {!auctionStarted ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center mb-8">
              <Gavel className="w-24 h-24 text-blue-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">Ready to Start Auction</h2>
              <p className="text-slate-400">Click the button below to begin the auction</p>
            </div>
            <button
              onClick={handleStartAuction}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold text-lg transition shadow-xl"
            >
              <Play className="w-6 h-6" />
              Start Auction
            </button>
          </div>
        ) : !currentPlayer ? (
          <div className="flex flex-col items-center justify-center py-20">
            <CheckCircle className="w-24 h-24 text-green-400 mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Auction Complete!</h2>
            <p className="text-slate-400">All players have been auctioned</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Current Player</h2>
                  <div className="flex gap-2">
                    {auctionPaused ? (
                      <button
                        onClick={resumeAuction}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                      >
                        <Play className="w-4 h-4" />
                        Resume
                      </button>
                    ) : (
                      <button
                        onClick={pauseAuction}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition"
                      >
                        <Pause className="w-4 h-4" />
                        Pause
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-4xl font-bold text-white mb-2">{currentPlayer.name}</h3>
                    <div className="space-y-2 text-slate-300">
                      <p><span className="font-semibold">Role:</span> {currentPlayer.role}</p>
                      <p><span className="font-semibold">Nationality:</span> {currentPlayer.nationality}</p>
                      <p><span className="font-semibold">Age:</span> {currentPlayer.age}</p>
                      <p><span className="font-semibold">Base Price:</span> {currentPlayer.basePrice}L</p>
                    </div>
                  </div>

                  <div className="bg-slate-700 rounded-lg p-6">
                    <div className="text-center mb-4">
                      <p className="text-sm text-slate-400 mb-1">Current Bid</p>
                      <p className="text-5xl font-bold text-amber-400">{currentBid}L</p>
                      {currentBiddingTeam && (
                        <p className="text-lg text-slate-300 mt-2">
                          by <span className="font-semibold text-blue-400">{currentBiddingTeam.name}</span>
                        </p>
                      )}
                    </div>

                    {bidHistory.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-600">
                        <p className="text-xs text-slate-400 mb-2">Bid History</p>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {bidHistory.slice(-5).reverse().map((bid, idx) => {
                            const team = teams.find(t => t.id === bid.teamId);
                            return (
                              <div key={idx} className="flex justify-between text-sm">
                                <span className="text-slate-300">{team?.shortName}</span>
                                <span className="text-amber-400">{bid.amount}L</span>
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

            <div className="bg-slate-800 rounded-xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Place Bid</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <select
                  value={selectedTeam || ''}
                  onChange={e => setSelectedTeam(Number(e.target.value))}
                  className="px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select Team</option>
                  {eligibleTeams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name} (Purse: {team.purse}L)
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  value={bidAmount || ''}
                  onChange={e => setBidAmount(Number(e.target.value))}
                  placeholder="Bid Amount"
                  className="px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                />

                <button
                  onClick={handlePlaceBid}
                  disabled={!selectedTeam || bidAmount <= currentBid}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition font-semibold"
                >
                  <TrendingUp className="w-4 h-4" />
                  Place Bid
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setBidAmount(currentBid + 10)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-sm"
                >
                  +10L
                </button>
                <button
                  onClick={() => setBidAmount(currentBid + 25)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-sm"
                >
                  +25L
                </button>
                <button
                  onClick={() => setBidAmount(currentBid + 50)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-sm"
                >
                  +50L
                </button>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Auction Controls</h3>
              <div className="flex gap-4">
                <button
                  onClick={handleSold}
                  disabled={!currentBidder}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition font-semibold text-lg shadow-lg"
                >
                  <CheckCircle className="w-5 h-5" />
                  Sold
                </button>

                <button
                  onClick={handleUnsold}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition font-semibold text-lg shadow-lg"
                >
                  <XCircle className="w-5 h-5" />
                  Unsold
                </button>

                <button
                  onClick={nextPlayer}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-semibold"
                >
                  <SkipForward className="w-5 h-5" />
                  Skip
                </button>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Team Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {teams.map(team => (
                  <div
                    key={team.id}
                    className={`p-4 rounded-lg border-2 ${
                      team.id === currentBidder
                        ? 'border-amber-400 bg-amber-900/20'
                        : 'border-slate-700 bg-slate-700/30'
                    }`}
                  >
                    <p className="font-semibold text-white text-sm mb-1">{team.shortName}</p>
                    <p className="text-2xl font-bold text-amber-400">{team.purse}L</p>
                    <p className="text-xs text-slate-400">{team.players.length} players</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
