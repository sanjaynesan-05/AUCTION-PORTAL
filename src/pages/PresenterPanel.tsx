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
  TrendingUp,
  Users,
  Trophy,
  Activity
} from 'lucide-react';

export default function PresenterPanel() {
  const { user, logout } = useRole();
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
    markSold,
    markUnsold,
  } = useAuctionSync();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
          
          {/* Main Player Card */}
          <div className="xl:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
              {/* Player Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                    <img
                      src={currentPlayer.image}
                      alt={currentPlayer.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white/30 bg-white/10 mx-auto sm:mx-0"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${currentPlayer.name}&background=6366f1&color=fff&size=80`;
                      }}
                    />
                    <div className="text-center sm:text-left">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{currentPlayer.name}</h2>
                      <div className="flex flex-wrap justify-center sm:justify-start items-center space-x-2 mt-2">
                        <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-white">
                          {currentPlayer.role}
                        </span>
                        <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-white">
                          {currentPlayer.nationality}
                        </span>
                        <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-white">
                          Age: {currentPlayer.age}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center sm:text-right w-full sm:w-auto">
                    <p className="text-white/80 text-sm">Base Price</p>
                    <p className="text-2xl sm:text-3xl font-bold text-yellow-400">₹{currentPlayer.basePrice}L</p>
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
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
                  <div className="text-center sm:text-left">
                    <p className="text-gray-400 text-sm">Current Bid</p>
                    <p className="text-3xl sm:text-4xl font-bold text-white">₹{currentBid}L</p>
                    {currentBiddingTeam && (
                      <div className="flex items-center justify-center sm:justify-start mt-2">
                        <img
                          src={currentBiddingTeam.logo}
                          alt={currentBiddingTeam.name}
                          className="w-6 h-6 mr-2"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${currentBiddingTeam.shortName}&background=${currentBiddingTeam.color.slice(1)}&color=fff&size=24`;
                          }}
                        />
                        <span className="text-gray-300 text-sm">{currentBiddingTeam.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Auction Controls */}
                  <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-3">
                    {!auctionStarted ? (
                      <button
                        onClick={startAuction}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center transition-colors text-sm sm:text-base"
                      >
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Start Auction
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={previousPlayer}
                          className="bg-gray-600 hover:bg-gray-700 text-white p-2 sm:p-3 rounded-lg transition-colors"
                        >
                          <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        {auctionPaused ? (
                          <button
                            onClick={resumeAuction}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center transition-colors text-sm sm:text-base"
                          >
                            <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Resume
                          </button>
                        ) : (
                          <button
                            onClick={pauseAuction}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center transition-colors text-sm sm:text-base"
                          >
                            <Pause className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Pause
                          </button>
                        )}

                        <button
                          onClick={nextPlayer}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2 sm:p-3 rounded-lg transition-colors"
                        >
                          <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {auctionStarted && !auctionPaused && (
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                      onClick={handleSold}
                      disabled={!currentBidder}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 sm:px-6 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
                    >
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      SOLD
                    </button>
                    <button
                      onClick={handleUnsold}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 sm:px-6 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
                    >
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
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