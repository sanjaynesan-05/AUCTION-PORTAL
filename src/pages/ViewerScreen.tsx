import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useAuctionSync } from '../hooks/useAuctionSync';
import { mockTeams } from '../data/mockTeams';
import {
  LogOut,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Tv,
  Trophy,
  Activity,
  Star,
  Target,
  Zap,
  Gavel
} from 'lucide-react';

export default function ViewerScreen() {
  const { user, logout } = useRole();
  const navigate = useNavigate();
  const {
    currentPlayer,
    teams,
    players,
    auctionStarted,
    auctionPaused,
    currentBid,
    currentBidder,
    bidHistory,
    placeBidFromViewer,
    getNextBidIncrement
  } = useAuctionSync();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [customBid, setCustomBid] = useState<string>('');
  const [bidMessage, setBidMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  // Get authenticated team
  const authenticatedTeam = teams.find(t => t.id === user?.teamId);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Clear message after 3 seconds
  useEffect(() => {
    if (bidMessage) {
      const timer = setTimeout(() => setBidMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [bidMessage]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNextBid = () => {
    if (!authenticatedTeam) {
      setBidMessage({type: 'error', text: 'No authenticated team'});
      return;
    }
    const nextBid = currentBid + getNextBidIncrement(currentBid);
    const result = placeBidFromViewer(nextBid, authenticatedTeam.id);
    setBidMessage({type: result.success ? 'success' : 'error', text: result.message});
    if (result.success) setCustomBid('');
  };

  const handleCustomBid = () => {
    if (!authenticatedTeam) {
      setBidMessage({type: 'error', text: 'No authenticated team'});
      return;
    }
    const bidAmount = parseInt(customBid.replace(/,/g, ''));
    if (isNaN(bidAmount)) {
      setBidMessage({type: 'error', text: 'Please enter a valid bid amount'});
      return;
    }
    const result = placeBidFromViewer(bidAmount, authenticatedTeam.id);
    setBidMessage({type: result.success ? 'success' : 'error', text: result.message});
    if (result.success) setCustomBid('');
  };

  const handleQuickBid = (increment: number) => {
    if (!authenticatedTeam) {
      setBidMessage({type: 'error', text: 'No authenticated team'});
      return;
    }
    const bidAmount = currentBid + increment;
    const result = placeBidFromViewer(bidAmount, authenticatedTeam.id);
    setBidMessage({type: result.success ? 'success' : 'error', text: result.message});
    if (result.success) setCustomBid('');
  };

  const currentBiddingTeam = teams.find(t => t.id === currentBidder);
  const soldPlayers = players.filter(p => p.sold && p.teamId);
  const totalSpent = soldPlayers.reduce((sum, p) => sum + (p.price || 0), 0);

  if (!auctionStarted || !currentPlayer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                  <Tv className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">IPL Auction Portal</h1>
                  <p className="text-sm text-gray-300">Live Viewer</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-300">Welcome,</p>
                  <p className="text-white font-medium">{user?.username}</p>
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

        {/* Waiting Screen */}
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
              <Trophy className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              {!auctionStarted ? 'Auction Starting Soon...' : 'Auction Complete!'}
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              {!auctionStarted 
                ? 'Please wait while the auction begins'
                : 'All players have been processed'
              }
            </p>
            <div className="flex items-center justify-center text-gray-400">
              <Clock className="w-5 h-5 mr-2" />
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between h-auto lg:h-16 py-4 lg:py-0 space-y-4 lg:space-y-0">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                <Tv className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">IPL Auction Portal</h1>
                <p className="text-xs sm:text-sm text-gray-300">Live Viewer</p>
              </div>
            </div>

            {/* Live Status */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6 w-full lg:w-auto">
              <div className="flex items-center bg-red-600 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                <span className="text-white text-sm font-medium">LIVE</span>
              </div>
              <div className="text-gray-300 text-sm">
                <Clock className="w-4 h-4 inline mr-1" />
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-left sm:text-right flex-1 sm:flex-none">
                <p className="text-xs sm:text-sm text-gray-300">Welcome,</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Main Player Display */}
          <div className="xl:col-span-3">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
              {/* Player Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-8">
                <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6">
                  <div className="relative">
                    <img
                      src={currentPlayer.image}
                      alt={currentPlayer.name}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white/30 bg-white/10"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${currentPlayer.name}&background=6366f1&color=fff&size=128`;
                      }}
                    />
                    {currentPlayer.role === 'All-rounder' && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">{currentPlayer.name}</h2>
                    <div className="flex flex-wrap justify-center items-center space-x-2 sm:space-x-4 mb-3">
                      <span className="bg-white/20 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-white font-medium text-sm sm:text-base">
                        {currentPlayer.role}
                      </span>
                      <span className="bg-white/20 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-white text-sm sm:text-base">
                        {currentPlayer.nationality}
                      </span>
                      <span className="bg-white/20 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-white text-sm sm:text-base">
                        {currentPlayer.age} years
                      </span>
                    </div>
                    <div className="flex flex-wrap justify-center space-x-3 sm:space-x-4 text-gray-200 text-sm">
                      {currentPlayer.battingStyle && (
                        <span>🏏 {currentPlayer.battingStyle}</span>
                      )}
                      {currentPlayer.bowlingStyle && (
                        <span>⚾ {currentPlayer.bowlingStyle}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-center mt-4 sm:mt-6">
                  <p className="text-white/80 text-sm">Base Price</p>
                  <p className="text-3xl sm:text-4xl font-bold text-yellow-400">₹{currentPlayer.basePrice}L</p>
                  {auctionPaused && (
                    <div className="mt-2 bg-yellow-500/20 px-3 py-1 rounded-full inline-block">
                      <span className="text-yellow-300 text-sm font-medium">PAUSED</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Player Stats */}
              {currentPlayer.stats && (
                <div className="p-6 bg-white/5">
                  <h3 className="text-white font-semibold mb-6 flex items-center text-lg">
                    <Activity className="w-6 h-6 mr-3" />
                    Career Statistics
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {currentPlayer.stats.matches && (
                      <div className="text-center bg-white/10 rounded-lg p-4">
                        <p className="text-3xl font-bold text-white">{currentPlayer.stats.matches}</p>
                        <p className="text-gray-400 text-sm mt-1">Matches</p>
                      </div>
                    )}
                    {currentPlayer.stats.runs && (
                      <div className="text-center bg-white/10 rounded-lg p-4">
                        <p className="text-3xl font-bold text-green-400">{currentPlayer.stats.runs}</p>
                        <p className="text-gray-400 text-sm mt-1">Runs</p>
                      </div>
                    )}
                    {currentPlayer.stats.wickets && (
                      <div className="text-center bg-white/10 rounded-lg p-4">
                        <p className="text-3xl font-bold text-blue-400">{currentPlayer.stats.wickets}</p>
                        <p className="text-gray-400 text-sm mt-1">Wickets</p>
                      </div>
                    )}
                    {currentPlayer.stats.strikeRate && (
                      <div className="text-center bg-white/10 rounded-lg p-4">
                        <p className="text-3xl font-bold text-yellow-400">{currentPlayer.stats.strikeRate}</p>
                        <p className="text-gray-400 text-sm mt-1">Strike Rate</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Current Bid Display */}
              <div className="p-4 sm:p-8">
                <div className="text-center mb-6 sm:mb-8">
                  <p className="text-gray-400 text-base sm:text-lg mb-2">Current Highest Bid</p>
                  <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                    <Target className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
                    <p className="text-4xl sm:text-6xl font-bold text-white">₹{currentBid}L</p>
                    <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
                  </div>

                  {currentBiddingTeam && (
                    <div className="mt-4 sm:mt-6 flex items-center justify-center bg-white/10 rounded-lg p-3 sm:p-4 max-w-xs sm:max-w-md mx-auto">
                      <img
                        src={currentBiddingTeam.logo}
                        alt={currentBiddingTeam.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 mr-3 sm:mr-4"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${currentBiddingTeam.shortName}&background=${currentBiddingTeam.color.slice(1)}&color=fff&size=48`;
                        }}
                      />
                      <div className="text-left">
                        <p className="text-white font-bold text-base sm:text-lg">{currentBiddingTeam.name}</p>
                        <p className="text-gray-300 text-sm">Leading Bidder</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recent Bids */}
                {bidHistory.length > 0 && (
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Bidding Activity
                    </h3>
                    <div className="space-y-3">
                      {bidHistory.slice(-5).reverse().map((bid, idx) => {
                        const team = teams.find(t => t.id === bid.teamId);
                        return (
                          <div key={idx} className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                            <div className="flex items-center">
                              {team && (
                                <img
                                  src={team.logo}
                                  alt={team.name}
                                  className="w-10 h-10 mr-3"
                                  onError={(e) => {
                                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${team.shortName}&background=${team.color.slice(1)}&color=fff&size=40`;
                                  }}
                                />
                              )}
                              <div>
                                <p className="text-white font-medium">{team?.name}</p>
                                <p className="text-gray-400 text-xs">
                                  {new Date(bid.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                            <span className="text-yellow-400 font-bold text-lg">₹{bid.amount}L</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Team Bidding Panel */}
            {auctionStarted && currentPlayer && !currentPlayer.sold ? (
              authenticatedTeam ? (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                  <h3 className="text-white font-semibold mb-4 flex items-center">
                    <Gavel className="w-5 h-5 mr-2" />
                    Place Your Bid
                  </h3>

                  {/* Authenticated Team Display */}
                  <div className="mb-4 p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30">
                    <div className="flex items-center space-x-3">
                      <img src={authenticatedTeam.logo} alt={authenticatedTeam.name} className="w-8 h-8 object-contain" />
                      <div>
                        <div className="text-white font-semibold">{authenticatedTeam.name}</div>
                        <div className="text-sm text-gray-300">₹{(authenticatedTeam.purse / 100).toFixed(1)}Cr remaining</div>
                      </div>
                    </div>
                  </div>

                  {/* Bid Message */}
                  {bidMessage && (
                    <div className={`mb-4 p-3 rounded-lg ${
                      bidMessage.type === 'success'
                        ? 'bg-green-500/20 border border-green-500/30 text-green-300'
                        : 'bg-red-500/20 border border-red-500/30 text-red-300'
                    }`}>
                      {bidMessage.text}
                    </div>
                  )}

                  {/* Bidding Controls */}
                  <div className="space-y-3">
                    <button
                      onClick={handleNextBid}
                      disabled={!authenticatedTeam}
                      className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                    >
                      Next Bid (+₹{getNextBidIncrement(currentBid).toLocaleString()})
                    </button>

                    {/* Quick Bid Buttons */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <button
                        onClick={() => handleQuickBid(10)}
                        disabled={!authenticatedTeam}
                        className="px-3 sm:px-4 py-3 sm:py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm sm:text-base min-h-[44px]"
                      >
                        +₹10L
                      </button>
                      <button
                        onClick={() => handleQuickBid(25)}
                        disabled={!authenticatedTeam}
                        className="px-3 sm:px-4 py-3 sm:py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm sm:text-base min-h-[44px]"
                      >
                        +₹25L
                      </button>
                      <button
                        onClick={() => handleQuickBid(50)}
                        disabled={!authenticatedTeam}
                        className="px-3 sm:px-4 py-3 sm:py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm sm:text-base min-h-[44px]"
                      >
                        +₹50L
                      </button>
                      <button
                        onClick={() => handleQuickBid(100)}
                        disabled={!authenticatedTeam}
                        className="px-3 sm:px-4 py-3 sm:py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm sm:text-base min-h-[44px]"
                      >
                        +₹100L
                      </button>
                    </div>

                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={customBid}
                        onChange={(e) => setCustomBid(e.target.value)}
                        placeholder="Enter bid amount"
                        className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleCustomBid}
                        disabled={!customBid}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
                      >
                        Bid
                      </button>
                    </div>
                  </div>

                  {/* Increment Rules */}
                  <div className="mt-4 p-3 bg-white/5 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Bid Increment Rules</h4>
                    <div className="text-xs text-gray-400 space-y-1">
                      <div>₹0-1Cr: +₹5L</div>
                      <div>₹1-2Cr: +₹10L</div>
                      <div>₹2-3Cr: +₹20L</div>
                      <div>₹3-5Cr: +₹25L</div>
                      <div>₹5Cr+: +₹50L</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-500/20 backdrop-blur-md rounded-xl p-6 border border-red-500/30">
                  <h3 className="text-xl font-bold text-red-300 mb-2">Authentication Required</h3>
                  <p className="text-red-200 text-sm">Please log in with team credentials to place bids.</p>
                </div>
              )
            ) : null}

            {/* Auction Stats */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Auction Overview
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Players Sold</span>
                  <span className="text-white font-bold">{soldPlayers.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Remaining</span>
                  <span className="text-white font-bold">{players.filter(p => !p.sold).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Spent</span>
                  <span className="text-green-400 font-bold">₹{totalSpent}L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Avg Price</span>
                  <span className="text-yellow-400 font-bold">
                    ₹{soldPlayers.length > 0 ? Math.round(totalSpent / soldPlayers.length) : 0}L
                  </span>
                </div>
              </div>
            </div>

            {/* Team Standings */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Team Purse Remaining
              </h3>
              <div className="space-y-3">
                {teams
                  .sort((a, b) => b.purse - a.purse)
                  .map((team, idx) => (
                    <div key={team.id} className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="text-gray-400 text-sm w-6">{idx + 1}.</span>
                          <img
                            src={team.logo}
                            alt={team.name}
                            className="w-8 h-8 mx-2"
                            onError={(e) => {
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${team.shortName}&background=${team.color.slice(1)}&color=fff&size=32`;
                            }}
                          />
                          <div>
                            <p className="text-white font-medium text-sm">{team.shortName}</p>
                            <p className="text-gray-400 text-xs">{team.players.length} players</p>
                          </div>
                        </div>
                        <p className="text-white font-bold">₹{team.purse}L</p>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${(team.purse / 1000) * 100}%`,
                            backgroundColor: team.color
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Live Feed */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Live Updates
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {bidHistory.slice(-10).reverse().map((bid, idx) => {
                  const team = teams.find(t => t.id === bid.teamId);
                  return (
                    <div key={idx} className="text-sm bg-white/5 rounded p-2">
                      <span className="text-yellow-400 font-medium">{team?.shortName}</span>
                      <span className="text-gray-300"> bid </span>
                      <span className="text-white font-bold">₹{bid.amount}L</span>
                      <span className="text-gray-500 block text-xs">
                        {new Date(bid.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}