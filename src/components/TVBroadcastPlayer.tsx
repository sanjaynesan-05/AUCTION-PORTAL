import React from 'react';
import { 
  Star, 
  Activity, 
  Target, 
  Zap 
} from 'lucide-react';

interface Player {
  id: number;
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
  id: number;
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
    <div className="space-y-4">
      {/* Player Header - TV Style Banner */}
      <div className="relative bg-gradient-to-r from-blue-900 via-purple-800 to-pink-900 rounded-xl overflow-hidden border border-white/20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative flex items-center p-6">
          {/* Player Image */}
          <div className="relative mr-6 flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-1">
              <img
                src={currentPlayer.image}
                alt={currentPlayer.name}
                className="w-full h-full rounded-full object-cover bg-white/10"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${currentPlayer.name}&background=6366f1&color=fff&size=80`;
                }}
              />
            </div>
            {currentPlayer.role === 'All-rounder' && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-black" />
              </div>
            )}
          </div>
          
          {/* Player Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">{currentPlayer.name}</h1>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-3 py-1 bg-blue-600 text-white text-sm font-bold rounded-full uppercase tracking-wide">
                {currentPlayer.role}
              </span>
              <span className="text-yellow-300 font-semibold">{currentPlayer.nationality}</span>
              <span className="text-gray-300">{currentPlayer.age}y</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              {currentPlayer.battingStyle && <span>🏏 {currentPlayer.battingStyle}</span>}
              {currentPlayer.bowlingStyle && <span>⚾ {currentPlayer.bowlingStyle}</span>}
            </div>
          </div>
          
          {/* Base Price Banner */}
          <div className="text-right flex-shrink-0">
            <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-lg px-4 py-3">
              <p className="text-yellow-300 text-xs font-semibold uppercase tracking-wide">Base Price</p>
              <p className="text-2xl font-black text-yellow-400">₹{currentPlayer.basePrice}L</p>
            </div>
            {auctionPaused && (
              <div className="mt-2 bg-red-500/20 px-3 py-1 rounded-full">
                <span className="text-red-300 text-xs font-bold">● PAUSED</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Player Stats - TV Style Stats Bar */}
      {currentPlayer.stats && (
        <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-white font-bold text-lg">CAREER STATS</h3>
            </div>
            
            {/* Stats Grid - Horizontal TV Style */}
            <div className="flex items-center space-x-6">
              {currentPlayer.stats.matches && (
                <div className="text-center">
                  <p className="text-2xl font-black text-white">{currentPlayer.stats.matches}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Matches</p>
                </div>
              )}
              {currentPlayer.stats.runs && (
                <div className="text-center border-l border-white/20 pl-6">
                  <p className="text-2xl font-black text-green-400">{currentPlayer.stats.runs}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Runs</p>
                </div>
              )}
              {currentPlayer.stats.wickets && (
                <div className="text-center border-l border-white/20 pl-6">
                  <p className="text-2xl font-black text-blue-400">{currentPlayer.stats.wickets}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Wickets</p>
                </div>
              )}
              {currentPlayer.stats.strikeRate && (
                <div className="text-center border-l border-white/20 pl-6">
                  <p className="text-2xl font-black text-yellow-400">{currentPlayer.stats.strikeRate}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">S/R</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Current Bid Display - TV Style Ticker */}
      <div className="relative bg-gradient-to-r from-red-900 via-orange-800 to-yellow-600 rounded-xl overflow-hidden border border-white/20">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative p-6">
          <div className="flex items-center justify-between">
            
            {/* Current Bid Section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="text-yellow-200 text-sm font-semibold uppercase tracking-wide">Current Bid</p>
                  <p className="text-4xl font-black text-white">₹{currentBid}L</p>
                </div>
              </div>
              
              {/* Live Indicator */}
              <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white text-xs font-bold uppercase tracking-wide">Live</span>
              </div>
            </div>

            {/* Leading Team Section */}
            {currentBiddingTeam && (
              <div className="flex items-center space-x-3 bg-black/30 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                <img
                  src={currentBiddingTeam.logo}
                  alt={currentBiddingTeam.name}
                  className="w-10 h-10"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${currentBiddingTeam.shortName}&background=${currentBiddingTeam.color.slice(1)}&color=fff&size=40`;
                  }}
                />
                <div>
                  <p className="text-white font-bold text-lg">{currentBiddingTeam.shortName}</p>
                  <p className="text-yellow-300 text-xs font-semibold uppercase tracking-wide">Leading Bidder</p>
                </div>
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};