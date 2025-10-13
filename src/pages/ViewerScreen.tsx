import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useAuctionSync } from '../hooks/useAuctionSync';
import { TVBroadcastPlayer } from '../components/TVBroadcastPlayer';
import { FloatingTeamPurse } from '../components/FloatingTeamPurse';
import {
  LogOut,
  Clock,
  DollarSign,
  Users,
  Tv,
  Trophy,
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
    placeBidFromViewer
  } = useAuctionSync();

  const [currentTime, setCurrentTime] = useState(new Date());
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

  const handleQuickBid = (increment: number) => {
    if (!authenticatedTeam) {
      setBidMessage({type: 'error', text: 'No authenticated team'});
      return;
    }
    const bidAmount = currentBid + increment;
    const result = placeBidFromViewer(bidAmount, authenticatedTeam.id);
    setBidMessage({type: result.success ? 'success' : 'error', text: result.message});
  };

  const handleStartFirstBid = () => {
    if (!authenticatedTeam || !currentPlayer) {
      setBidMessage({type: 'error', text: 'No authenticated team'});
      return;
    }
    // Place bid at base price
    const result = placeBidFromViewer(currentPlayer.basePrice, authenticatedTeam.id);
    setBidMessage({type: result.success ? 'success' : 'error', text: result.message});
  };

  // Get dynamic bid increments based on current bid
  const getBidIncrements = (currentBid: number): number[] => {
    if (currentBid < 100) {
      // ₹0L-100L: +₹5L increments
      return [5, 10, 15, 20];
    } else if (currentBid < 200) {
      // ₹100L-200L: +₹10L increments
      return [10, 20, 30, 40];
    } else if (currentBid < 300) {
      // ₹200L-300L: +₹20L increments
      return [20, 40, 60, 80];
    } else if (currentBid < 500) {
      // ₹300L-500L: +₹25L increments
      return [25, 50, 75, 100];
    } else {
      // ₹500L+: +₹50L increments
      return [50, 100, 150, 200];
    }
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
          
          {/* Main Player Display - TV Broadcast Style */}
          <div className="xl:col-span-3 space-y-6">
            <TVBroadcastPlayer
              currentPlayer={currentPlayer}
              currentBid={currentBid}
              currentBiddingTeam={currentBiddingTeam}
              auctionPaused={auctionPaused}
            />

            {/* Team Bidding Panel - Moved below player details */}
            {auctionStarted && currentPlayer && !currentPlayer.sold && (
              <div className="mt-6">
                {authenticatedTeam ? (
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
                      {/* Conditional Bidding Buttons */}
                      {currentBid === 0 || !currentBiddingTeam ? (
                        /* Show "Start First Bid" button when no bids yet */
                        <button
                          onClick={handleStartFirstBid}
                          disabled={!authenticatedTeam}
                          className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all text-lg shadow-lg hover:shadow-xl hover:scale-105 transform duration-200"
                        >
                          🎯 Start First Bid at ₹{currentPlayer.basePrice}L
                        </button>
                      ) : (
                        /* Show Dynamic Quick Bid Increment Buttons based on current bid */
                        <>
                          <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            {getBidIncrements(currentBid).map((increment, index) => {
                              const colors = [
                                'bg-blue-600 hover:bg-blue-700',
                                'bg-purple-600 hover:bg-purple-700',
                                'bg-indigo-600 hover:bg-indigo-700',
                                'bg-orange-600 hover:bg-orange-700'
                              ];
                              return (
                                <button
                                  key={index}
                                  onClick={() => handleQuickBid(increment)}
                                  disabled={!authenticatedTeam}
                                  className={`px-3 sm:px-4 py-3 sm:py-2 ${colors[index]} disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm sm:text-base min-h-[44px]`}
                                >
                                  +₹{increment}L
                                </button>
                              );
                            })}
                          </div>
                          
                          {/* Current Bid Range Indicator */}
                          <div className="text-center text-xs text-gray-400 mt-2">
                            {currentBid < 100 && '₹0L-100L: +₹5L increments'}
                            {currentBid >= 100 && currentBid < 200 && '₹100L-200L: +₹10L increments'}
                            {currentBid >= 200 && currentBid < 300 && '₹200L-300L: +₹20L increments'}
                            {currentBid >= 300 && currentBid < 500 && '₹300L-500L: +₹25L increments'}
                            {currentBid >= 500 && '₹500L+: +₹50L increments'}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Increment Rules */}
                    <div className="mt-4 p-3 bg-white/5 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">📋 Bid Increment Rules</h4>
                      <div className="text-xs text-gray-400 space-y-1">
                        <div className={currentBid < 100 ? 'text-yellow-400 font-semibold' : ''}>₹0L-100L: +₹5L</div>
                        <div className={currentBid >= 100 && currentBid < 200 ? 'text-yellow-400 font-semibold' : ''}>₹100L-200L: +₹10L</div>
                        <div className={currentBid >= 200 && currentBid < 300 ? 'text-yellow-400 font-semibold' : ''}>₹200L-300L: +₹20L</div>
                        <div className={currentBid >= 300 && currentBid < 500 ? 'text-yellow-400 font-semibold' : ''}>₹300L-500L: +₹25L</div>
                        <div className={currentBid >= 500 ? 'text-yellow-400 font-semibold' : ''}>₹500L+: +₹50L</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-500/20 backdrop-blur-md rounded-xl p-6 border border-red-500/30">
                    <h3 className="text-xl font-bold text-red-300 mb-2">Authentication Required</h3>
                    <p className="text-red-200 text-sm">Please log in with team credentials to place bids.</p>
                  </div>
                )}
              </div>
            )}
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

            {/* My Team Players */}
            {authenticatedTeam && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  My Team Players
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {players.filter(p => p.sold && p.teamId === authenticatedTeam.id).length > 0 ? (
                    players
                      .filter(p => p.sold && p.teamId === authenticatedTeam.id)
                      .map((player) => (
                        <div key={player.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <img
                              src={player.image}
                              alt={player.name}
                              className="w-8 h-8 rounded-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${player.name}&background=${authenticatedTeam.color.slice(1)}&color=fff&size=32`;
                              }}
                            />
                            <div>
                              <div className="text-white font-medium text-sm">{player.name}</div>
                              <div className="text-gray-400 text-xs">{player.role}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-green-400 font-bold text-sm">₹{player.price}L</div>
                            <div className="text-gray-500 text-xs">{player.nationality}</div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center text-gray-400 py-4">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No players acquired yet</p>
                    </div>
                  )}
                </div>
                {players.filter(p => p.sold && p.teamId === authenticatedTeam.id).length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Total Players:</span>
                      <span className="text-white font-bold">
                        {players.filter(p => p.sold && p.teamId === authenticatedTeam.id).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Total Spent:</span>
                      <span className="text-green-400 font-bold">
                        ₹{players.filter(p => p.sold && p.teamId === authenticatedTeam.id).reduce((sum, p) => sum + (p.price || 0), 0)}L
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

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

      {/* Floating Team Purse Button */}
      <FloatingTeamPurse teams={teams} />
    </div>
  );
}