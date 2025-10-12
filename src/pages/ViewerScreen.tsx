import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useAuctionSync } from '../hooks/useAuctionSync';
import { LogOut, Clock, DollarSign, Users, TrendingUp, Tv } from 'lucide-react';

export default function ViewerScreen() {
  const { username, logout } = useRole();
  const navigate = useNavigate();
  const {
    currentPlayer,
    teams,
    players,
    auctionStarted,
    currentBid,
    currentBidder,
    bidHistory,
  } = useAuctionSync();

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentBiddingTeam = teams.find(t => t.id === currentBidder);
  const soldPlayers = players.filter(p => p.sold && p.teamId);
  const totalSpent = soldPlayers.reduce((sum, p) => sum + (p.price || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <nav className="bg-black/50 border-b border-slate-800 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Tv className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold text-white">Live Auction View</h1>
                <p className="text-xs text-slate-400">Viewing as {username}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-mono">
                  {time.toLocaleTimeString()}
                </span>
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
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!auctionStarted || !currentPlayer ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="bg-slate-900/50 rounded-2xl p-12 text-center backdrop-blur-sm border border-slate-800">
              <Tv className="w-24 h-24 text-blue-400 mx-auto mb-6 animate-pulse" />
              <h2 className="text-3xl font-bold text-white mb-3">
                {!auctionStarted ? 'Auction Not Started' : 'Auction Complete'}
              </h2>
              <p className="text-slate-400 text-lg">
                {!auctionStarted
                  ? 'Waiting for the auction to begin...'
                  : 'All players have been auctioned. Thank you for watching!'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-900/30 to-slate-900/30 rounded-2xl shadow-2xl overflow-hidden border border-slate-800 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <h2 className="text-3xl font-bold text-white">LIVE AUCTION</h2>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="flex flex-col justify-center">
                    <div className="mb-6">
                      <p className="text-blue-400 text-sm font-semibold mb-2">NOW ON AUCTION</p>
                      <h3 className="text-5xl font-bold text-white mb-4">{currentPlayer.name}</h3>
                      <div className="space-y-2 text-lg text-slate-300">
                        <p>
                          <span className="text-slate-500">Role:</span>{' '}
                          <span className="font-semibold">{currentPlayer.role}</span>
                        </p>
                        <p>
                          <span className="text-slate-500">Nationality:</span>{' '}
                          <span className="font-semibold">{currentPlayer.nationality}</span>
                        </p>
                        <p>
                          <span className="text-slate-500">Age:</span>{' '}
                          <span className="font-semibold">{currentPlayer.age}</span>
                        </p>
                        <p>
                          <span className="text-slate-500">Base Price:</span>{' '}
                          <span className="font-semibold text-amber-400">{currentPlayer.basePrice}L</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-8 text-center shadow-2xl">
                      <p className="text-amber-100 text-sm font-semibold mb-2">CURRENT BID</p>
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <DollarSign className="w-12 h-12 text-white" />
                        <p className="text-7xl font-bold text-white">{currentBid}</p>
                        <span className="text-3xl text-white font-bold">L</span>
                      </div>
                      {currentBiddingTeam && (
                        <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                          <p className="text-amber-100 text-sm mb-1">Leading Bidder</p>
                          <p className="text-2xl font-bold text-white">{currentBiddingTeam.name}</p>
                        </div>
                      )}
                    </div>

                    {bidHistory.length > 0 && (
                      <div className="mt-6 bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                        <p className="text-sm text-slate-400 mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Recent Bids
                        </p>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {bidHistory.slice(-5).reverse().map((bid, idx) => {
                            const team = teams.find(t => t.id === bid.teamId);
                            return (
                              <div
                                key={idx}
                                className="flex justify-between items-center text-sm bg-slate-800/50 rounded px-3 py-2"
                              >
                                <span className="text-slate-300 font-medium">{team?.shortName}</span>
                                <span className="text-amber-400 font-bold">{bid.amount}L</span>
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-6 h-6 text-blue-400" />
                  <span className="text-3xl font-bold text-white">{soldPlayers.length}</span>
                </div>
                <p className="text-slate-400 text-sm">Players Sold</p>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-6 h-6 text-amber-400" />
                  <span className="text-3xl font-bold text-white">{totalSpent}</span>
                </div>
                <p className="text-slate-400 text-sm">Total Spent (L)</p>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-6 h-6 text-green-400" />
                  <span className="text-3xl font-bold text-white">
                    {players.filter(p => !p.sold).length}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">Remaining</p>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-6 h-6 text-red-400" />
                  <span className="text-3xl font-bold text-white">{teams.length}</span>
                </div>
                <p className="text-slate-400 text-sm">Teams</p>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-xl shadow-xl p-6 border border-slate-800 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Team Standings
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {teams
                  .sort((a, b) => a.purse - b.purse)
                  .map((team, idx) => {
                    const spent = 1000 - team.purse;
                    return (
                      <div
                        key={team.id}
                        className={`p-4 rounded-lg border-2 ${
                          team.id === currentBidder
                            ? 'border-amber-400 bg-amber-900/20 shadow-lg shadow-amber-500/20'
                            : 'border-slate-700 bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-bold text-white">{team.shortName}</p>
                          {idx === 0 && <span className="text-xs text-amber-400">🏆</span>}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400">Purse</span>
                            <span className="text-lg font-bold text-green-400">{team.purse}L</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400">Spent</span>
                            <span className="text-sm font-semibold text-red-400">{spent}L</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400">Players</span>
                            <span className="text-sm font-semibold text-blue-400">
                              {team.players.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
