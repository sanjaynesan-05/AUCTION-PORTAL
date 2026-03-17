import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useAuctionSync } from '../hooks/useAuctionSync';
import { useState, useEffect } from 'react';
import { TVBroadcastPlayer } from '../components/TVBroadcastPlayer';
import { FloatingTeamPurse } from '../components/FloatingTeamPurse';
import SoldUnsoldModal from '../components/SoldUnsoldModal';
import {
  Trophy,
  Crown,
  Clock
} from 'lucide-react';

export default function PresenterPanel() {
  const { logout } = useRole();
  const navigate = useNavigate();
  const {
    currentPlayer,
    teams,
    players,
    auctionStarted,
    auctionPaused,
    currentBid,
    currentBidder,
    currentSetName,
  } = useAuctionSync();

  const [soldConfirmation, setSoldConfirmation] = useState<any>(null);

  useEffect(() => {
    const checkSoldConfirmation = () => {
      const confirmation = localStorage.getItem('soldConfirmation');
      if (confirmation) {
        const data = JSON.parse(confirmation);
        setSoldConfirmation(data);
        setTimeout(() => {
          localStorage.removeItem('soldConfirmation');
          setSoldConfirmation(null);
        }, 5000);
      }
    };
    window.addEventListener('storage', checkSoldConfirmation);
    checkSoldConfirmation();
    return () => window.removeEventListener('storage', checkSoldConfirmation);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentBiddingTeam = teams ? teams.find(t => t.id === currentBidder) : undefined;

  if (!auctionStarted && !currentPlayer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-[#1a0b2e] to-indigo-950 text-white flex flex-col pt-16 font-['Inter'] relative overflow-hidden">
        <div className="fixed top-0 left-0 right-0 h-16 bg-black/40 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-8 z-50">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide">IPL AUCTION BROADCAST</h1>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <div className="text-right mr-3">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Presenter Mode</p>
                <div className="flex items-center justify-end mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)] mr-2"></div>
                  <p className="text-white font-bold text-sm leading-none">Live</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full px-8">
          <div className="text-center">
            <Trophy className="w-32 h-32 text-indigo-400/30 mx-auto mb-8 stroke-[1]" />
            <h1 className="text-7xl font-black mb-6 tracking-tight text-white uppercase drop-shadow-lg">Auction Room Ready</h1>
            <p className="text-2xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">Awaiting the auctioneer to initiate the first player draw.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-[#1a0b2e] to-[#0d0722] text-white pt-16 font-['Inter'] relative overflow-hidden flex flex-col">
      <div className="fixed top-0 left-0 right-0 h-16 bg-black/40 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-50">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-md flex items-center justify-center mr-4 shadow-lg shadow-amber-500/20">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-widest uppercase">IPL MEGA AUCTION</h1>
            <p className="text-xs text-yellow-500/80 font-bold uppercase tracking-[0.2em]">{currentSetName || 'Session 1'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
            <Clock className="w-4 h-4 text-cyan-400 mr-2" />
            <span className="font-mono text-sm font-bold tracking-widest text-white/90">{new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity" onClick={handleLogout}>
            <div className="text-right mr-3">
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-none">System</p>
              <p className="text-white font-bold text-sm leading-tight mt-1 uppercase tracking-wider">Presenter</p>
            </div>
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full flex items-center justify-center p-8 lg:p-12">
        {currentPlayer ? (
          <TVBroadcastPlayer
            currentPlayer={currentPlayer}
            currentBid={currentBid}
            currentBiddingTeam={currentBiddingTeam}
            auctionPaused={auctionPaused}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <Trophy className="w-24 h-24 text-white/10 mb-6" />
            <p className="text-gray-500 font-bold tracking-[0.3em] uppercase text-2xl">Waiting for Player...</p>
          </div>
        )}
      </div>

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