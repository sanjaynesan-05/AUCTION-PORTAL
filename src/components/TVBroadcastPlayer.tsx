import React from 'react';
import { Target, Zap } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  role: string;
  nationality: string;
  age: number;
  image: string;
  basePrice?: number;
}

interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  color: string;
}

interface TVBroadcastPlayerProps {
  currentPlayer: Player;
  currentBid: number;
  currentBiddingTeam?: Team;
  auctionPaused: boolean;
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

export const TVBroadcastPlayer: React.FC<TVBroadcastPlayerProps> = ({
  currentPlayer,
  currentBid,
  currentBiddingTeam,
  auctionPaused
}) => {
  return (
    <div className="flex flex-col lg:flex-row w-full h-full min-h-[70vh] items-stretch gap-12 lg:gap-8 animate-in fade-in duration-500 py-4 max-w-[1700px] mx-auto">

      {/* 1. LARGE PLAYER IMAGE SECTION (Left Side - 55%) */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center items-center lg:items-end relative">
        <div className="w-full max-w-[700px] aspect-[4/5] sm:aspect-square md:aspect-[4/3] lg:aspect-auto lg:h-[75vh] lg:max-h-[850px] relative rounded-[2rem] p-1.5 bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-800 shadow-[0_0_80px_rgba(99,102,241,0.25)] flex shrink-0 group overflow-hidden">
          <div className="w-full h-full rounded-[1.8rem] bg-[#151525] flex items-center justify-center overflow-hidden relative shadow-inner">
            {currentPlayer.image && !currentPlayer.image.includes('ui-avatars') ? (
              <img
                src={currentPlayer.image}
                alt={currentPlayer.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.querySelector('.fallback-initials')?.classList.remove('hidden');
                }}
              />
            ) : null}
            <span className={`fallback-initials text-9xl font-black text-white/20 tracking-tighter ${currentPlayer.image && !currentPlayer.image.includes('ui-avatars') ? 'hidden' : ''}`}>
              {getInitials(currentPlayer.name)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. PLAYER INFORMATION PANEL (Right Side - 45%) */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center space-y-10 lg:pl-10 text-center lg:text-left relative">

        {/* 3. PLAYER NAME */}
        <div>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white uppercase tracking-tight drop-shadow-2xl leading-[0.9]">
            {currentPlayer.name}
          </h1>
        </div>

        {/* 4. PLAYER DETAILS */}
        <div className="flex flex-col text-2xl sm:text-3xl font-medium text-gray-300 space-y-2">
          <span>{currentPlayer.nationality}</span>
          <span>Age: {currentPlayer.age}</span>
          <span>{currentPlayer.role}</span>
        </div>

        {/* 5. BASE PRICE CARD */}
        <div className="pt-4">
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-sm mb-3">Base Price</p>
          <div className="inline-block bg-white/5 border border-yellow-500/30 rounded-2xl px-8 py-3 shadow-[0_0_20px_rgba(234,179,8,0.05)] backdrop-blur-md">
            <span className="text-3xl font-bold text-white tracking-wider">₹ {currentPlayer.basePrice ?? 200} L</span>
          </div>
        </div>

        {/* 6. CURRENT BID VALUE (LIVE) */}
        <div className="pt-4 w-full max-w-sm mx-auto lg:mx-0">
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-sm mb-3 flex items-center justify-center lg:justify-start">
            <Target className="w-4 h-4 mr-2 text-yellow-500" />
            Current Bid
          </p>
          <div className="bg-[#111118]/80 backdrop-blur-2xl rounded-3xl border border-white/10 px-8 py-10 shadow-2xl relative flex flex-col items-center">

            <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-600/90 px-3 py-1 rounded-full z-10">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white text-[10px] font-black uppercase tracking-widest leading-none">Live</span>
            </div>

            <p className="text-7xl font-black text-white italic tracking-tighter mb-8 mt-2 drop-shadow-lg">
              ₹ {currentBid} L
            </p>

            {currentBiddingTeam ? (
              <div className="flex items-center justify-center space-x-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 w-full">
                <img
                  src={currentBiddingTeam.logo}
                  alt={currentBiddingTeam.name}
                  loading="lazy"
                  className="w-12 h-12 object-contain shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${currentBiddingTeam.shortName}&background=${currentBiddingTeam.color.slice(1)}&color=fff&size=48`;
                  }}
                />
                <div className="overflow-hidden text-center">
                  <p className="text-2xl font-black text-yellow-400 uppercase italic tracking-wider truncate">
                    {currentBiddingTeam.shortName || currentBiddingTeam.name}
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full text-center py-5 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Waiting for Bids</p>
              </div>
            )}
          </div>
        </div>

        {/* Paused Indicator (If needed, subtle placement) */}
        {auctionPaused && (
          <div className="inline-flex items-center bg-red-500/10 border border-red-500/20 px-6 py-3 rounded-2xl animate-pulse self-center lg:self-start">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
            <span className="text-red-500 font-black uppercase tracking-[0.2em]">Live Paused</span>
          </div>
        )}

      </div>
    </div>
  );
};

