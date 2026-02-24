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
  Trophy,
  Activity,
  Crown,
  Users,
  Clock,
  Zap
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

  const [stampAnimation, setStampAnimation] = useState<{ type: 'sold' | 'unsold' | null, show: boolean }>({
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
    if (auctionStarted) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-12 text-center shadow-2xl animate-scale-in">
            <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4 uppercase italic tracking-tighter">Auction Complete</h2>
            <p className="text-gray-400 font-medium mb-8">All players have been processed through the system.</p>
            <button
              onClick={() => navigate('/admin')}
              className="w-full flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all border border-white/10 font-black uppercase tracking-widest text-sm"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-8">
        <div className="text-center space-y-12 max-w-2xl bg-white/10 backdrop-blur-xl p-16 rounded-[3rem] border border-white/10 shadow-3xl">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl animate-pulse transform rotate-12">
              <Crown className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
              <Zap className="w-6 h-6 text-black" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">Ready to<br />Begin</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-yellow-500 mx-auto rounded-full"></div>
            <p className="text-gray-400 font-bold tracking-[0.3em] uppercase text-sm">Waiting for Session Start</p>
          </div>

          <div className="pt-4">
            <button
              onClick={startAuction}
              className="bg-white text-slate-950 px-12 py-5 rounded-2xl flex items-center transition-all font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 group"
            >
              <Play className="w-6 h-6 mr-4 group-hover:scale-110 transition-transform" fill="currentColor" />
              Open Session
            </button>
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
          <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-16 py-4 sm:py-0 space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">IPL Auction Portal</h1>
                <p className="text-xs sm:text-sm text-gray-300 tracking-wider uppercase">Presenter Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-400 capitalize">Logged in as</p>
                <p className="text-white font-semibold flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  {user?.username}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-all border border-red-500/20 shadow-lg active:scale-95"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Display Area */}
          <div className="lg:col-span-3 space-y-6">

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
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 shadow-2xl">
              <TVBroadcastPlayer
                currentPlayer={currentPlayer}
                currentBid={currentBid}
                currentBiddingTeam={currentBiddingTeam}
                auctionPaused={auctionPaused}
              />
            </div>

            {/* Presenter Controls */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
              <div className="space-y-6">

                {/* Auction Flow Controls */}
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div className="flex space-x-3">
                    <button
                      onClick={previousPlayer}
                      className="bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-xl transition-all border border-white/5 active:scale-95"
                      title="Previous Player"
                    >
                      <SkipBack className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextPlayer}
                      className="bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-xl transition-all border border-white/5 active:scale-95"
                      title="Next Player"
                    >
                      <SkipForward className="w-6 h-6" />
                    </button>
                  </div>

                  {!auctionStarted ? (
                    <button
                      onClick={startAuction}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white px-10 py-4 rounded-xl flex items-center transition-all font-black uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95"
                    >
                      <Play className="w-6 h-6 mr-3" />
                      Open Session
                    </button>
                  ) : (
                    <div className="flex items-center bg-black/40 px-6 py-4 rounded-2xl border border-white/5">
                      {auctionPaused ? (
                        <button
                          onClick={resumeAuction}
                          className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl flex items-center transition-all font-black uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-95"
                        >
                          <Play className="w-5 h-5 mr-2" />
                          Resume
                        </button>
                      ) : (
                        <button
                          onClick={pauseAuction}
                          className="bg-yellow-600 hover:bg-yellow-500 text-white px-8 py-3 rounded-xl flex items-center transition-all font-black uppercase tracking-widest shadow-[0_0_20px_rgba(234,179,8,0.3)] active:scale-95"
                        >
                          <Pause className="w-5 h-5 mr-2" />
                          Pause Bid
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Major Conclusion Actions */}
                {auctionStarted && !auctionPaused && (
                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                    <button
                      onClick={handleSold}
                      disabled={!currentBidder}
                      className="bg-green-600 hover:bg-green-500 disabled:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-6 px-8 rounded-2xl flex items-center justify-center transition-all font-black text-2xl uppercase tracking-widest shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:scale-[1.02] active:scale-95"
                    >
                      <CheckCircle className="w-8 h-8 mr-3" />
                      Confirm SOLD
                    </button>
                    <button
                      onClick={handleUnsold}
                      className="bg-red-600 hover:bg-red-500 text-white py-6 px-8 rounded-2xl flex items-center justify-center transition-all font-black text-2xl uppercase tracking-widest shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:scale-[1.02] active:scale-95"
                    >
                      <XCircle className="w-8 h-8 mr-3" />
                      Mark UNSOLD
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
              <h3 className="text-white font-bold mb-6 flex items-center text-lg uppercase tracking-wider italic">
                <Users className="w-6 h-6 mr-3 text-cyan-400" />
                Team Status
              </h3>

              <div className="space-y-3">
                {[...teams].sort((a, b) => (a.rank || 99) - (b.rank || 99)).map(team => (
                  <div key={team.id} className={`bg-black/20 rounded-xl p-4 border transition-all duration-300 ${team.id === currentBidder ? 'border-yellow-400 shadow-lg shadow-yellow-400/20 scale-[1.02]' : 'border-white/5'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <img
                          src={team.logo}
                          alt={team.name}
                          className="w-8 h-8 mr-3 object-contain"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${team.shortName}&background=${team.color.slice(1)}&color=fff&size=32`;
                          }}
                        />
                        <div>
                          <div className="flex items-center">
                            <p className="text-white font-bold tracking-wide">{team.shortName}</p>
                            {team.rank && (
                              <span className="ml-1.5 px-1 py-0.5 bg-yellow-500 text-black text-[8px] font-black rounded">
                                #{team.rank}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-[10px] font-medium uppercase tracking-tight">
                            {team.players.length} Players • {team.totalPoints || 0} Pts
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-black ${team.purse < 50 ? 'text-red-400' : 'text-yellow-400'}`}>₹{team.purse}L</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest leading-none">Rem. Purse</p>
                      </div>
                    </div>
                    {/* Purse Progress Bar */}
                    <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/5">
                      <div
                        className={`h-full transition-all duration-1000 ${team.purse < 50 ? 'bg-red-500' : 'bg-gradient-to-r from-yellow-600 to-yellow-400'}`}
                        style={{ width: `${(team.purse / 120) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bid History Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
              <h3 className="text-white font-bold mb-6 flex items-center text-lg uppercase tracking-wider italic">
                <TrendingUp className="w-6 h-6 mr-3 text-yellow-400" />
                Live Bidding
              </h3>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {bidHistory.length > 0 ? (
                  [...bidHistory].reverse().map((bid, idx) => {
                    const team = teams.find(t => t.id === bid.teamId);
                    return (
                      <div key={idx} className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/5 animate-slide-in">
                        <div className="flex items-center">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 font-bold text-xs"
                            style={{ backgroundColor: team?.color + '20', color: team?.color, border: `1px solid ${team?.color}40` }}
                          >
                            {team?.shortName}
                          </div>
                          <div>
                            <p className="text-white font-black text-sm">₹{bid.amount}L</p>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                              {new Date(bid.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <Activity className="w-4 h-4 text-green-500/50" />
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
                    <Clock className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Waiting for first bid...</p>
                  </div>
                )}
              </div>
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