import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useAuctionSync } from '../hooks/useAuctionSync';
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
  Zap
} from 'lucide-react';

export default function ViewerScreen() {
  const { username, logout } = useRole();
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
  } = useAuctionSync();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
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
            
            {/* Live Status */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center bg-red-600 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                <span className="text-white text-sm font-medium">LIVE</span>
              </div>
              <div className="text-gray-300 text-sm">
                <Clock className="w-4 h-4 inline mr-1" />
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-300">Welcome,</p>
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
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Main Player Display */}
          <div className="xl:col-span-3">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
              {/* Player Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img
                        src={currentPlayer.image}
                        alt={currentPlayer.name}
                        className="w-32 h-32 rounded-full border-4 border-white/30 bg-white/10"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${currentPlayer.name}&background=6366f1&color=fff&size=128`;
                        }}
                      />
                      {currentPlayer.role === 'All-rounder' && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Star className="w-4 h-4 text-black" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold text-white mb-2">{currentPlayer.name}</h2>
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="bg-white/20 px-4 py-2 rounded-full text-white font-medium">
                          {currentPlayer.role}
                        </span>
                        <span className="bg-white/20 px-4 py-2 rounded-full text-white">
                          {currentPlayer.nationality}
                        </span>
                        <span className="bg-white/20 px-4 py-2 rounded-full text-white">
                          {currentPlayer.age} years
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        {currentPlayer.battingStyle && (
                          <span className="text-gray-200 text-sm">🏏 {currentPlayer.battingStyle}</span>
                        )}
                        {currentPlayer.bowlingStyle && (
                          <span className="text-gray-200 text-sm">⚾ {currentPlayer.bowlingStyle}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/80 text-sm">Base Price</p>
                    <p className="text-4xl font-bold text-yellow-400">₹{currentPlayer.basePrice}L</p>
                    {auctionPaused && (
                      <div className="mt-2 bg-yellow-500/20 px-3 py-1 rounded-full">
                        <span className="text-yellow-300 text-sm font-medium">PAUSED</span>
                      </div>
                    )}
                  </div>
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
              <div className="p-8">
                <div className="text-center mb-8">
                  <p className="text-gray-400 text-lg mb-2">Current Highest Bid</p>
                  <div className="flex items-center justify-center space-x-4">
                    <Target className="w-8 h-8 text-yellow-400" />
                    <p className="text-6xl font-bold text-white">₹{currentBid}L</p>
                    <Zap className="w-8 h-8 text-yellow-400" />
                  </div>
                  
                  {currentBiddingTeam && (
                    <div className="mt-6 flex items-center justify-center bg-white/10 rounded-lg p-4 max-w-md mx-auto">
                      <img
                        src={currentBiddingTeam.logo}
                        alt={currentBiddingTeam.name}
                        className="w-12 h-12 mr-4"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${currentBiddingTeam.shortName}&background=${currentBiddingTeam.color.slice(1)}&color=fff&size=48`;
                        }}
                      />
                      <div className="text-left">
                        <p className="text-white font-bold text-lg">{currentBiddingTeam.name}</p>
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
                            width: `${(team.purse / 12000) * 100}%`,
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