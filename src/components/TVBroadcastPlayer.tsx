import React from 'react';
import {
  Star,
  Activity,
  Target,
  Zap
} from 'lucide-react';

interface Player {
  id: string;
  name: string;
  role: string;
  nationality: string;
  age: number;
  basePrice: number;
  image: string;
  battingStyle?: string;
  bowlingStyle?: string;
  stats?: {
    matches?: number;
    runs?: number;
    wickets?: number;
    strikeRate?: number;
  };
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

export const TVBroadcastPlayer: React.FC<TVBroadcastPlayerProps> = ({
  currentPlayer,
  currentBid,
  currentBiddingTeam,
  auctionPaused
}) => {
  return (
    <div className="space-y-8">
      {/* Player Header - Dashboard Style */}
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        {/* Player Image with Dashboard Border */}
        <div className="relative group">
          <div className="w-48 h-48 rounded-2xl bg-white/5 border-2 border-white/10 p-2 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105">
            <img
              src={currentPlayer.image}
              alt={currentPlayer.name}
              loading="lazy"
              className="w-full h-full rounded-xl object-contain bg-slate-900"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${currentPlayer.name}&background=6366f1&color=fff&size=192`;
              }}
            />
          </div>
          {currentPlayer.role === 'All-rounder' && (
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg transform rotate-12">
              <Star className="w-5 h-5 text-black" />
            </div>
          )}
        </div>

        {/* Player Header Info */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <div className="inline-flex items-center px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-black rounded-lg uppercase tracking-widest mb-3">
              <Zap className="w-4 h-4 mr-2" />
              {currentPlayer.role}
            </div>
            <h1 className="text-5xl font-black text-white tracking-tight uppercase italic">{currentPlayer.name}</h1>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-lg">
            <div className="flex items-center text-gray-400 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
              <span className="font-bold text-white mr-2">{currentPlayer.nationality}</span>
              <span className="text-gray-600">|</span>
              <span className="ml-2 font-medium">{currentPlayer.age} Years</span>
            </div>
            <div className="flex items-center text-yellow-500 bg-yellow-500/5 px-4 py-2 rounded-xl border border-yellow-500/20 font-black">
              BASE: ₹{currentPlayer.basePrice}L
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        {auctionPaused && (
          <div className="flex items-center bg-red-500/10 border border-red-500/20 px-6 py-3 rounded-2xl animate-pulse">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
            <span className="text-red-500 font-black uppercase tracking-[0.2em]">Live Paused</span>
          </div>
        )}
      </div>

      {/* Stats and Bidding Grid - Unified Dashboard Look */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Career Stats Card */}
        {currentPlayer.stats && (
          <div className="bg-black/20 rounded-2xl border border-white/5 p-6 space-y-6">
            <div className="flex items-center border-b border-white/5 pb-4">
              <Activity className="w-5 h-5 text-cyan-400 mr-2" />
              <h3 className="text-gray-400 font-black uppercase tracking-widest text-sm italic">Career Statistics</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {currentPlayer.stats.matches !== undefined && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Matches</p>
                  <p className="text-3xl font-black text-white italic">{currentPlayer.stats.matches}</p>
                </div>
              )}
              {currentPlayer.stats.runs !== undefined && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Runs</p>
                  <p className="text-3xl font-black text-green-400 italic">{currentPlayer.stats.runs}</p>
                </div>
              )}
              {currentPlayer.stats.wickets !== undefined && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Wickets</p>
                  <p className="text-3xl font-black text-blue-400 italic">{currentPlayer.stats.wickets}</p>
                </div>
              )}
              {currentPlayer.stats.strikeRate !== undefined && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Strike Rate</p>
                  <p className="text-3xl font-black text-yellow-400 italic">{currentPlayer.stats.strikeRate}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Current Bid Card */}
        <div className="bg-gradient-to-br from-slate-900 to-black rounded-2xl border-2 border-yellow-500/50 p-6 space-y-6 shadow-[0_0_50px_rgba(234,179,8,0.1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white text-[10px] font-black uppercase tracking-widest">Live</span>
            </div>
          </div>

          <div className="flex items-center border-b border-white/5 pb-4">
            <Target className="w-5 h-5 text-yellow-400 mr-2" />
            <h3 className="text-gray-400 font-black uppercase tracking-widest text-sm italic">Current Bid Value</h3>
          </div>

          <div className="flex flex-col items-center justify-center h-full py-2">
            <p className="text-7xl font-black text-white italic tracking-tighter mb-4">₹{currentBid}L</p>

            {currentBiddingTeam ? (
              <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-6 py-4 w-full">
                <img
                  src={currentBiddingTeam.logo}
                  alt={currentBiddingTeam.name}
                  loading="lazy"
                  className="w-12 h-12 object-contain mr-4"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${currentBiddingTeam.shortName}&background=${currentBiddingTeam.color.slice(1)}&color=fff&size=48`;
                  }}
                />
                <div className="flex-1">
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Leading Bidder</p>
                  <p className="text-2xl font-black text-yellow-400 uppercase italic tracking-wider leading-none">{currentBiddingTeam.name}</p>
                </div>
                <Zap className="w-8 h-8 text-yellow-400 animate-pulse" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/5 rounded-2xl w-full">
                <p className="text-gray-600 font-black uppercase tracking-[0.2em] text-sm">Waiting for Bids</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
