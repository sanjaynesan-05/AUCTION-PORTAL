import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useAuctionSync } from '../hooks/useAuctionSync';
import {
  LogOut,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  CheckCircle,
  XCircle,
  Gavel,
  TrendingUp,
  Users,
  Clock,
  Trophy,
  Star,
  Activity
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
    previousPlayer,
    placeBid,
    markSold,
    markUnsold,
  } = useAuctionSync();

  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [bidAmount, setBidAmount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleQuickBid = (amount: number) => {
    if (selectedTeam) {
      placeBid(selectedTeam, amount);
      setBidAmount(amount);
    }
  };

  const handleSold = () => {
    if (currentPlayer && currentBidder) {
      markSold(currentPlayer.id, currentBidder, currentBid);
      setSelectedTeam(null);
      setBidAmount(0);
      nextPlayer();
    }
  };

  const handleUnsold = () => {
    if (currentPlayer) {
      markUnsold(currentPlayer.id);
      setSelectedTeam(null);
      setBidAmount(0);
      nextPlayer();
    }
  };

  const currentBiddingTeam = teams.find(t => t.id === currentBidder);
  const eligibleTeams = teams.filter(t => t.purse >= (currentBid + 10));

  if (!currentPlayer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
          <h2 className="text-3xl font-bold mb-4">Auction Complete!</h2>
          <p className="text-lg text-gray-300">All players have been processed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">IPL Auction Portal</h1>
                <p className="text-sm text-gray-300">Presenter Panel</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-300">Welcome back,</p>
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
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Main Player Card */}
          <div className="xl:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
              {/* Player Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={currentPlayer.image}
                      alt={currentPlayer.name}
                      className="w-20 h-20 rounded-full border-4 border-white/30 bg-white/10"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${currentPlayer.name}&background=6366f1&color=fff&size=80`;
                      }}
                    />
                    <div>
                      <h2 className="text-3xl font-bold text-white">{currentPlayer.name}</h2>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm text-white">
                          {currentPlayer.role}
                        </span>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm text-white">
                          {currentPlayer.nationality}
                        </span>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm text-white">
                          Age: {currentPlayer.age}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/80 text-sm">Base Price</p>
                    <p className="text-3xl font-bold text-yellow-400">₹{currentPlayer.basePrice}L</p>
                  </div>
                </div>
              </div>

              {/* Player Stats */}
              {currentPlayer.stats && (
                <div className="p-6 bg-white/5">
                  <h3 className="text-white font-semibold mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Career Statistics
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {currentPlayer.stats.matches && (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{currentPlayer.stats.matches}</p>
                        <p className="text-gray-400 text-sm">Matches</p>
                      </div>
                    )}
                    {currentPlayer.stats.runs && (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">{currentPlayer.stats.runs}</p>
                        <p className="text-gray-400 text-sm">Runs</p>
                      </div>
                    )}
                    {currentPlayer.stats.wickets && (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-400">{currentPlayer.stats.wickets}</p>
                        <p className="text-gray-400 text-sm">Wickets</p>
                      </div>
                    )}
                    {currentPlayer.stats.average && (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-400">{currentPlayer.stats.average}</p>
                        <p className="text-gray-400 text-sm">Average</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Current Bid Section */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-gray-400 text-sm">Current Bid</p>
                    <p className="text-4xl font-bold text-white">₹{currentBid}L</p>
                    {currentBiddingTeam && (
                      <div className="flex items-center mt-2">
                        <img
                          src={currentBiddingTeam.logo}
                          alt={currentBiddingTeam.name}
                          className="w-6 h-6 mr-2"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${currentBiddingTeam.shortName}&background=${currentBiddingTeam.color.slice(1)}&color=fff&size=24`;
                          }}
                        />
                        <span className="text-gray-300">{currentBiddingTeam.name}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Auction Controls */}
                  <div className="flex space-x-3">
                    {!auctionStarted ? (
                      <button
                        onClick={startAuction}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Start Auction
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={previousPlayer}
                          className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-lg transition-colors"
                        >
                          <SkipBack className="w-5 h-5" />
                        </button>
                        
                        {auctionPaused ? (
                          <button
                            onClick={resumeAuction}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors"
                          >
                            <Play className="w-5 h-5 mr-2" />
                            Resume
                          </button>
                        ) : (
                          <button
                            onClick={pauseAuction}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors"
                          >
                            <Pause className="w-5 h-5 mr-2" />
                            Pause
                          </button>
                        )}
                        
                        <button
                          onClick={nextPlayer}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"
                        >
                          <SkipForward className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {auctionStarted && !auctionPaused && (
                  <div className="flex space-x-4">
                    <button
                      onClick={handleSold}
                      disabled={!currentBidder}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      SOLD
                    </button>
                    <button
                      onClick={handleUnsold}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      UNSOLD
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bid History */}
            {bidHistory.length > 0 && (
              <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Recent Bids
                </h3>
                <div className="space-y-3">
                  {bidHistory.slice(-5).reverse().map((bid, idx) => {
                    const team = teams.find(t => t.id === bid.teamId);
                    return (
                      <div key={idx} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <div className="flex items-center">
                          {team && (
                            <img
                              src={team.logo}
                              alt={team.name}
                              className="w-8 h-8 mr-3"
                              onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${team.shortName}&background=${team.color.slice(1)}&color=fff&size=32`;
                              }}
                            />
                          )}
                          <span className="text-white">{team?.name}</span>
                        </div>
                        <span className="text-yellow-400 font-bold">₹{bid.amount}L</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Team Bidding Panel */}
            {auctionStarted && !auctionPaused && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <Gavel className="w-5 h-5 mr-2" />
                  Place Bid
                </h3>
                
                {/* Quick Bid Buttons */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => handleQuickBid(currentBid + 10)}
                    disabled={!selectedTeam}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    +₹10L
                  </button>
                  <button
                    onClick={() => handleQuickBid(currentBid + 25)}
                    disabled={!selectedTeam}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    +₹25L
                  </button>
                  <button
                    onClick={() => handleQuickBid(currentBid + 50)}
                    disabled={!selectedTeam}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    +₹50L
                  </button>
                  <button
                    onClick={() => handleQuickBid(currentBid + 100)}
                    disabled={!selectedTeam}
                    className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    +₹100L
                  </button>
                </div>

                {/* Team Selection */}
                <div className="space-y-2">
                  <p className="text-gray-300 text-sm mb-2">Select Team:</p>
                  {eligibleTeams.slice(0, 4).map(team => (
                    <button
                      key={team.id}
                      onClick={() => setSelectedTeam(team.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                        selectedTeam === team.id
                          ? 'bg-white/20 border-white/40'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <img
                          src={team.logo}
                          alt={team.name}
                          className="w-8 h-8 mr-3"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${team.shortName}&background=${team.color.slice(1)}&color=fff&size=32`;
                          }}
                        />
                        <div className="text-left">
                          <p className="text-white font-medium">{team.shortName}</p>
                          <p className="text-gray-400 text-xs">₹{team.purse}L remaining</p>
                        </div>
                      </div>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: team.color }}></div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Team Standings */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Team Purse Status
              </h3>
              <div className="space-y-3">
                {teams
                  .sort((a, b) => b.purse - a.purse)
                  .map((team, idx) => (
                    <div key={team.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <div className="flex items-center">
                        <span className="text-gray-400 text-sm w-6">{idx + 1}.</span>
                        <img
                          src={team.logo}
                          alt={team.name}
                          className="w-8 h-8 mx-3"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${team.shortName}&background=${team.color.slice(1)}&color=fff&size=32`;
                          }}
                        />
                        <div>
                          <p className="text-white font-medium">{team.shortName}</p>
                          <p className="text-gray-400 text-xs">{team.players.length} players</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">₹{team.purse}L</p>
                        <div className="w-20 bg-gray-700 rounded-full h-2 mt-1">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${(team.purse / 1000) * 100}%`,
                              backgroundColor: team.color
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}