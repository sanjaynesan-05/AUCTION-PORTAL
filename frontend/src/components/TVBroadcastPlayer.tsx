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
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start p-4 sm:p-6">
          {/* Player Image */}
          <div className="relative mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-1">
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
              <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <Star className="w-2 h-2 sm:w-3 sm:h-3 text-black" />
              </div>
            )}
          </div>
          
          {/* Player Info */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 tracking-tight">{currentPlayer.name}</h1>
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:gap-3 mb-2">
              <span className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-600 text-white text-xs sm:text-sm font-bold rounded-full uppercase tracking-wide">
                {currentPlayer.role}
              </span>
              <span className="text-yellow-300 font-semibold text-sm sm:text-base">{currentPlayer.nationality}</span>
              <span className="text-gray-300 text-sm sm:text-base">{currentPlayer.age}y</span>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-300">
              {currentPlayer.battingStyle && <span>🏏 {currentPlayer.battingStyle}</span>}
              {currentPlayer.bowlingStyle && <span>⚾ {currentPlayer.bowlingStyle}</span>}
            </div>
          </div>
          
          {/* Base Price Banner */}
          <div className="text-center sm:text-right flex-shrink-0 mt-4 sm:mt-0">
            <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-lg px-3 py-2 sm:px-4 sm:py-3">
              <p className="text-yellow-300 text-xs font-semibold uppercase tracking-wide">Base Price</p>
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-yellow-400">₹{currentPlayer.basePrice}L</p>
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
          <div className="flex flex-col sm:flex-row items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg">CAREER STATS</h3>
            </div>
            
            {/* Stats Grid - Responsive Layout */}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-6 sm:space-x-0">
              {currentPlayer.stats.matches && (
                <div className="text-center sm:border-l-0 sm:border-l sm:border-white/20 sm:pl-6">
                  <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white">{currentPlayer.stats.matches}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Matches</p>
                </div>
              )}
              {currentPlayer.stats.runs && (
                <div className="text-center border-l-0 sm:border-l sm:border-white/20 sm:pl-6">
                  <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-green-400">{currentPlayer.stats.runs}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Runs</p>
                </div>
              )}
              {currentPlayer.stats.wickets && (
                <div className="text-center border-l-0 sm:border-l sm:border-white/20 sm:pl-6">
                  <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-blue-400">{currentPlayer.stats.wickets}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Wickets</p>
                </div>
              )}
              {currentPlayer.stats.strikeRate && (
                <div className="text-center border-l-0 sm:border-l sm:border-white/20 sm:pl-6">
                  <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-yellow-400">{currentPlayer.stats.strikeRate}</p>
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
        <div className="relative p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            
            {/* Current Bid Section */}
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-yellow-200 text-xs sm:text-sm font-semibold uppercase tracking-wide">
                    {currentBid === 0 ? 'Starting Price' : 'Current Bid'}
                  </p>
                  <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white">₹{currentBid || currentPlayer.basePrice}L</p>
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
              <div className="flex items-center space-x-3 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2 sm:px-4 sm:py-3 border border-white/20">
                <img
                  src={currentBiddingTeam.logo}
                  alt={currentBiddingTeam.name}
                  className="w-8 h-8 sm:w-10 sm:h-10"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${currentBiddingTeam.shortName}&background=${currentBiddingTeam.color.slice(1)}&color=fff&size=40`;
                  }}
                />
                <div className="text-center sm:text-left">
                  <p className="text-white font-bold text-sm sm:text-base lg:text-lg">{currentBiddingTeam.shortName}</p>
                  <p className="text-yellow-300 text-xs font-semibold uppercase tracking-wide">Leading Bidder</p>
                </div>
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};