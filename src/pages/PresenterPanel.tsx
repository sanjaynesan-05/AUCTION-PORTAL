import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useAuctionSync } from '../hooks/useAuctionSync';
import { useState, useEffect } from 'react';
import { TVBroadcastPlayer } from '../components/TVBroadcastPlayer';
import { FloatingTeamPurse } from '../components/FloatingTeamPurse';
import SoldUnsoldModal from '../components/SoldUnsoldModal';
import {
  LogOut,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  CheckCircle,
  XCircle,
  TrendingUp,
  Trophy
} from 'lucide-react';

export default function PresenterPanel() {
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
    startAuction,
    pauseAuction,
    resumeAuction,
    nextPlayer,
    previousPlayer,
    markSold,
    markUnsold,
  } = useAuctionSync();

  const [stampAnimation, setStampAnimation] = useState<{type: 'sold' | 'unsold' | null, show: boolean}>({
    type: null,
    show: false
  });
  
  const [soldConfirmation, setSoldConfirmation] = useState<any>(null);

  // Listen for sold confirmations from admin
  useEffect(() => {
    const checkSoldConfirmation = () => {
      const confirmation = localStorage.getItem('soldConfirmation');
      if (confirmation) {
        const data = JSON.parse(confirmation);
        setSoldConfirmation(data);
        
        // Clear after 5 seconds
        setTimeout(() => {
          setSoldConfirmation(null);
          localStorage.removeItem('soldConfirmation');
        }, 5000);
      }
    };

    checkSoldConfirmation();
    
    // Listen for storage changes
    window.addEventListener('storage', checkSoldConfirmation);
    
    return () => window.removeEventListener('storage', checkSoldConfirmation);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSold = () => {
    if (currentPlayer && currentBidder) {
      markSold(currentPlayer.id, currentBidder, currentBid);
      setStampAnimation({ type: 'sold', show: true });
      setTimeout(() => {
        setStampAnimation({ type: null, show: false });
        nextPlayer();
      }, 2000);
    }
  };

  const handleUnsold = () => {
    if (currentPlayer) {
      markUnsold(currentPlayer.id);
      setStampAnimation({ type: 'unsold', show: true });
      setTimeout(() => {
        setStampAnimation({ type: null, show: false });
        nextPlayer();
      }, 2000);
    }
  };

  const currentBiddingTeam = teams.find(t => t.id === currentBidder);

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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between h-auto sm:h-16 py-4 sm:py-0 space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">IPL Auction Portal</h1>
                <p className="text-xs sm:text-sm text-gray-300">Presenter Panel</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <div className="text-left sm:text-right">
                <p className="text-xs sm:text-sm text-gray-300">Welcome back,</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Main Player Display - TV Broadcast Style */}
          <div className="lg:col-span-2 relative space-y-6">
            
            {/* Stamp Animation Overlay */}
            {stampAnimation.show && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                {/* Confetti Animation - Only for SOLD */}
                {stampAnimation.type === 'sold' && (
                  <div className="confetti-container">
                    {Array.from({ length: 20 }, (_, i) => (
                      <div key={i} className="confetti-piece"></div>
                    ))}
                  </div>
                )}
                
                <div className={`stamp-animation ${stampAnimation.type === 'sold' ? 'stamp-sold' : 'stamp-unsold'}`}>
                  <div className="stamp-text">
                    {stampAnimation.type === 'sold' ? 'SOLD' : 'UNSOLD'}
                  </div>
                </div>
              </div>
            )}

            {/* TV Broadcast Player Component */}
            <TVBroadcastPlayer
              currentPlayer={currentPlayer}
              currentBid={currentBid}
              currentBiddingTeam={currentBiddingTeam}
              auctionPaused={auctionPaused}
            />

            {/* Presenter Controls */}
            <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-white/20 p-6">
              <div className="space-y-4">
                
                {/* Auction Controls */}
                <div className="flex flex-wrap justify-center gap-3">
                  {!auctionStarted ? (
                    <button
                      onClick={startAuction}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg flex items-center transition-colors font-semibold"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start Auction
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={previousPlayer}
                        className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-lg transition-colors"
                        title="Previous Player"
                      >
                        <SkipBack className="w-5 h-5" />
                      </button>

                      {auctionPaused ? (
                        <button
                          onClick={resumeAuction}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors font-semibold"
                        >
                          <Play className="w-5 h-5 mr-2" />
                          Resume
                        </button>
                      ) : (
                        <button
                          onClick={pauseAuction}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors font-semibold"
                        >
                          <Pause className="w-5 h-5 mr-2" />
                          Pause
                        </button>
                      )}

                      <button
                        onClick={nextPlayer}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"
                        title="Next Player"
                      >
                        <SkipForward className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                {auctionStarted && !auctionPaused && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <button
                      onClick={handleSold}
                      disabled={!currentBidder}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl flex items-center justify-center transition-all font-bold text-lg hover:scale-105"
                    >
                      <CheckCircle className="w-6 h-6 mr-2" />
                      SOLD
                    </button>
                    <button
                      onClick={handleUnsold}
                      className="bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-xl flex items-center justify-center transition-all font-bold text-lg hover:scale-105"
                    >
                      <XCircle className="w-6 h-6 mr-2" />
                      UNSOLD
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Recent Bids */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 sticky top-6">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Recent Bids
              </h3>
              
              {bidHistory.length > 0 ? (
                <div className="space-y-3">
                  {bidHistory.slice(-6).reverse().map((bid, idx) => {
                    const team = teams.find(t => t.id === bid.teamId);
                    return (
                      <div key={idx} className="flex items-center justify-between bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          {team && (
                            <img
                              src={team.logo}
                              alt={team.name}
                              className="w-8 h-8 flex-shrink-0"
                              onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${team.shortName}&background=${team.color.slice(1)}&color=fff&size=32`;
                              }}
                            />
                          )}
                          <span className="text-white text-sm font-medium truncate">{team?.shortName}</span>
                        </div>
                        <span className="text-yellow-400 font-bold text-lg ml-2 flex-shrink-0">₹{bid.amount}L</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 mx-auto text-gray-500 mb-3" />
                  <p className="text-gray-400 text-sm">No bids yet</p>
                  <p className="text-gray-500 text-xs mt-1">Bids will appear here</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Floating Team Purse Button */}
      <FloatingTeamPurse teams={teams} players={players} />

      {/* Use Reusable SoldUnsoldModal Component */}
      {soldConfirmation && (
        <SoldUnsoldModal
          playerName={soldConfirmation.playerName}
          playerImage={soldConfirmation.playerImage}
          teamName={soldConfirmation.teamName}
          teamLogo={soldConfirmation.teamLogo}
          price={soldConfirmation.price}
          unsold={soldConfirmation.unsold}
        />
      )}
    </div>
  );
}