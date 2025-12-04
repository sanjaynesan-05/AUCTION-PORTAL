import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useAuctionSync } from '../hooks/useAuctionSync';
import SoldModal from '../components/SoldModal';
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
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [lastSoldPlayer, setLastSoldPlayer] = useState<any>(null);
  const [lastSoldTeam, setLastSoldTeam] = useState<any>(null);
  const [lastSoldAmount, setLastSoldAmount] = useState(0);


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleQuickBid = async (amount: number) => {
    if (selectedTeam) {
      await placeBid(selectedTeam, amount);
      setBidAmount(amount);
    }
  };

  const handleSold = async () => {
    if (currentPlayer && currentBidder) {
      const soldTeam = teams.find(t => t.id === currentBidder);
      
      console.log('Marking player sold:', {
        player: currentPlayer,
        team: soldTeam,
        bidder: currentBidder,
        bid: currentBid
      });
      
      // Show modal with sold details FIRST
      setLastSoldPlayer({ ...currentPlayer });
      setLastSoldTeam(soldTeam ? { ...soldTeam } : null);
      setLastSoldAmount(currentBid);
      setShowSoldModal(true);
      
      // Then mark sold in backend
      await markSold(currentPlayer.id, currentBidder, currentBid);
      setSelectedTeam(null);
      setBidAmount(0);
    }
  };

  const handleSoldModalClose = async () => {
    setShowSoldModal(false);
    // Add small delay before moving to next player to allow UI update
    setTimeout(async () => {
      await nextPlayer();
    }, 300);
  };

  const handleUnsold = async () => {
    if (currentPlayer) {
      await markUnsold(currentPlayer.id);
      setSelectedTeam(null);
      setBidAmount(0);
      await nextPlayer();
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

            {/* Team Purse Status - Enhanced Design */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Team Purse Status</h3>
                    <p className="text-gray-400 text-sm">Live auction purse tracking</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium">Live</span>
                </div>
              </div>

              <div className="grid gap-4">
                {teams
                  .sort((a, b) => b.purse - a.purse)
                  .map((team, idx) => {
                    const pursePercentage = (team.purse / 12000) * 100;
                    const isTopTeam = idx < 3;

                    return (
                      <div
                        key={team.id}
                        className="group relative overflow-hidden bg-gradient-to-r from-white/5 to-white/10 rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                      >
                        {/* Background gradient overlay */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                          style={{
                            background: `linear-gradient(135deg, ${team.color}20, ${team.color}10)`
                          }}
                        ></div>

                        <div className="relative flex items-center justify-between">
                          {/* Left side - Team info */}
                          <div className="flex items-center space-x-4">
                            {/* Ranking */}
                            <div className={`flex items-center justify-center w-10 h-10 rounded-xl font-bold text-lg transition-all duration-300 ${
                              idx === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg' :
                              idx === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-black shadow-lg' :
                              idx === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg' :
                              'bg-white/10 text-white'
                            }`}>
                              {idx + 1}
                            </div>

                            {/* Team logo */}
                            <div className="relative">
                              <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300"
                                style={{ backgroundColor: `${team.color}15` }}
                              >
                                <img
                                  src={team.logo}
                                  alt={team.name}
                                  className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
                                  onError={(e) => {
                                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${team.shortName}&background=${team.color.slice(1)}&color=fff&size=40`;
                                  }}
                                />
                              </div>
                              {isTopTeam && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                                  <Star className="w-3 h-3 text-black" />
                                </div>
                              )}
                            </div>

                            {/* Team details */}
                            <div className="flex-1">
                              <h4 className="text-white font-bold text-lg group-hover:text-yellow-400 transition-colors duration-300">
                                {team.shortName}
                              </h4>
                              <div className="flex items-center space-x-4 mt-1">
                                <div className="flex items-center space-x-1">
                                  <Users className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-400 text-sm">{team.players.length} players</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <TrendingUp className="w-4 h-4 text-green-400" />
                                  <span className="text-green-400 text-sm font-medium">
                                    ₹{(12000 - team.purse).toFixed(1)}L spent
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right side - Purse info */}
                          <div className="text-right flex flex-col items-end space-y-3">
                            {/* Purse amount */}
                            <div className="text-right">
                              <div className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">
                                ₹{team.purse}L
                              </div>
                              <div className="text-xs text-gray-400">
                                {pursePercentage.toFixed(1)}% remaining
                              </div>
                            </div>

                            {/* Enhanced progress bar */}
                            <div className="w-32 relative">
                              <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                                  style={{
                                    width: `${pursePercentage}%`,
                                    background: `linear-gradient(90deg, ${team.color}, ${team.color}dd)`,
                                    boxShadow: `0 0 10px ${team.color}40`
                                  }}
                                ></div>
                              </div>
                              {/* Progress indicator */}
                              <div
                                className="absolute top-0 w-1 h-3 rounded-full transition-all duration-1000 ease-out"
                                style={{
                                  left: `${pursePercentage}%`,
                                  transform: 'translateX(-50%)',
                                  backgroundColor: team.color,
                                  boxShadow: `0 0 8px ${team.color}80`
                                }}
                              ></div>
                            </div>

                            {/* Status indicator */}
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                              pursePercentage > 70 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                              pursePercentage > 40 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                              'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {pursePercentage > 70 ? 'Healthy' : pursePercentage > 40 ? 'Moderate' : 'Low'}
                            </div>
                          </div>
                        </div>

                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 translate-x-full group-hover:translate-x-0"></div>
                      </div>
                    );
                  })}
              </div>

              {/* Summary stats */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                  <div className="text-2xl font-bold text-yellow-400">₹{teams.reduce((sum, team) => sum + team.purse, 0)}L</div>
                  <div className="text-sm text-gray-400">Total Remaining</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                  <div className="text-2xl font-bold text-blue-400">{teams.reduce((sum, team) => sum + team.players.length, 0)}</div>
                  <div className="text-sm text-gray-400">Players Bought</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                  <div className="text-2xl font-bold text-green-400">₹{(12000 * 10) - teams.reduce((sum, team) => sum + team.purse, 0)}L</div>
                  <div className="text-sm text-gray-400">Total Spent</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sold Modal */}
      <SoldModal
        isOpen={showSoldModal}
        player={lastSoldPlayer}
        team={lastSoldTeam}
        soldAmount={lastSoldAmount}
        onClose={handleSoldModalClose}
      />
    </div>
  );
}