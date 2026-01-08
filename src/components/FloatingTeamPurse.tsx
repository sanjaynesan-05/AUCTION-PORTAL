import React, { useState } from 'react';
import { DollarSign, X, ChevronRight } from 'lucide-react';

interface Player {
  id: number;
  name: string;
  role: string;
  price?: number;
  sold?: boolean;
  teamId?: number;
  image: string;
}

interface Team {
  id: number;
  name: string;
  shortName: string;
  logo: string;
  color: string;
  purse: number;
}

interface FloatingTeamPurseProps {
  teams: Team[];
  players?: Player[];
}

export const FloatingTeamPurse: React.FC<FloatingTeamPurseProps> = ({ teams, players = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Sort teams by purse remaining (highest to lowest)
  const sortedTeams = [...teams].sort((a, b) => b.purse - a.purse);
  const totalInitialPurse = 120; // 120 Cr per team (standard IPL)

  // Get players for a specific team
  const getTeamPlayers = (teamId: number): Player[] => {
    return players.filter(p => p.teamId === teamId && p.sold);
  };

  // Calculate total spent by a team
  const getTotalSpent = (teamId: number): number => {
    return getTeamPlayers(teamId).reduce((total, player) => total + (player.price || 0), 0);
  };

  // Calculate purse percentage
  const getPursePercentage = (purse: number): number => {
    return (purse / totalInitialPurse) * 100;
  };

  const handleTeamClick = (team: Team) => {
    setSelectedTeam(selectedTeam?.id === team.id ? null : team);
  };

  // Circle SVG Component for Purse Progress
  const PurseProgressRing = ({ team, size = 'md' }: { team: Team; size?: 'sm' | 'md' | 'lg' }) => {
    const percentage = getPursePercentage(team.purse);
    const circumference = 2 * Math.PI * 45; // radius = 45
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    const getColor = () => {
      if (percentage < 25) return '#ef4444'; // red
      if (percentage < 50) return '#f97316'; // orange
      if (percentage < 75) return '#eab308'; // yellow
      return '#22c55e'; // green
    };

    const sizeClasses = {
      sm: 'w-14 h-14',
      md: 'w-16 h-16',
      lg: 'w-20 h-20'
    };

    const imageSize = {
      sm: 'w-10 h-10',
      md: 'w-12 h-12',
      lg: 'w-14 h-14'
    };

    return (
      <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
        <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="6"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={getColor()}
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.5s ease, stroke 0.5s ease',
              filter: 'drop-shadow(0 0 4px ' + getColor() + '80)',
            }}
          />
        </svg>
        
        {/* Team Logo in Center */}
        <img
          src={team.logo}
          alt={team.name}
          className={`${imageSize[size]} rounded-full object-cover border-2 border-white/30 relative z-10`}
          onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${team.shortName}&background=${team.color.slice(1)}&color=fff&size=80`;
          }}
        />
      </div>
    );
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        aria-label="Toggle Team Purse"
      >
        <DollarSign className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-black">{teams.length}</span>
        </div>
      </button>

      {/* Floating Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => {
              setIsOpen(false);
              setSelectedTeam(null);
            }}
          />
          
          {/* Main Panel - Full Screen Grid */}
          <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-slate-900 to-purple-900 md:inset-auto md:bottom-20 md:right-4 md:left-auto md:w-[92vw] md:h-[85vh] lg:w-[1100px] lg:h-[550px] md:rounded-2xl md:border md:border-white/20 md:shadow-2xl md:backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-3 md:p-4 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base md:text-lg">
                    {selectedTeam ? `${selectedTeam.name} Squad` : 'Team Purse Status'}
                  </h3>
                  <p className="text-gray-400 text-xs md:text-sm">
                    {selectedTeam ? `${getTeamPlayers(selectedTeam.id).length} Players Bought` : 'IPL 2026 Budget Status'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (selectedTeam) {
                    setSelectedTeam(null);
                  } else {
                    setIsOpen(false);
                  }
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Content - Teams List or Team Details */}
            <div className="flex-1 overflow-y-auto custom-scrollbar md:overflow-hidden">
              {!selectedTeam ? (
                // Teams Grid View - All 10 Teams Without Scrolling
                <div className="p-2 md:p-3 grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-2.5 h-full auto-rows-max md:auto-rows-fr">
                  {sortedTeams.map((team) => {
                    const teamPlayers = getTeamPlayers(team.id);
                    
                    return (
                      <div
                        key={team.id}
                        onClick={() => handleTeamClick(team)}
                        className="bg-white/5 hover:bg-white/10 rounded-lg p-2 md:p-3 transition-all duration-300 border border-white/10 hover:border-white/20 cursor-pointer group flex flex-col items-center justify-center min-h-fit"
                      >
                        {/* Circular Progress Ring */}
                        <div className="mb-2 md:mb-3 flex-shrink-0">
                          <PurseProgressRing team={team} size="sm" />
                        </div>

                        {/* Team Info */}
                        <div className="text-center w-full flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-white font-bold text-xs md:text-sm">{team.shortName}</h3>
                            <p className="text-gray-400 text-xs mb-1 hidden md:block line-clamp-1 text-[10px]">{team.name}</p>
                          </div>
                          
                          {/* Purse and Players Info */}
                          <div className="space-y-1 text-xs">
                            <div>
                              <p className="text-gray-500 text-[10px]">Purse</p>
                              <p className="text-green-400 font-bold text-xs">{(team.purse / 100).toFixed(1)}Cr</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-[10px]">Players</p>
                              <p className="text-blue-400 font-bold text-xs">{teamPlayers.length}</p>
                            </div>
                          </div>

                          {/* Chevron - Mobile Only */}
                          <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors mt-1 md:mt-0 md:hidden" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Team Details View - Players Bought
                <div className="p-4 md:p-6 space-y-3 overflow-y-auto">
                  {/* Team Summary with Circular Progress */}
                  <div className="bg-white/5 rounded-xl p-4 md:p-6 border border-white/10">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex-shrink-0">
                        <PurseProgressRing team={selectedTeam} size="lg" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg md:text-xl">{selectedTeam.name}</h3>
                        <p className="text-gray-400 text-sm">{selectedTeam.shortName}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-4">
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <p className="text-gray-400 text-xs mb-1">Purse Left</p>
                        <p className="text-green-400 font-bold text-lg md:text-xl">{(selectedTeam.purse / 100).toFixed(1)}Cr</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <p className="text-gray-400 text-xs mb-1">Total Spent</p>
                        <p className="text-yellow-400 font-bold text-lg md:text-xl">{(getTotalSpent(selectedTeam.id) / 100).toFixed(1)}Cr</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <p className="text-gray-400 text-xs mb-1">Players</p>
                        <p className="text-blue-400 font-bold text-lg md:text-xl">{getTeamPlayers(selectedTeam.id).length}</p>
                      </div>
                    </div>
                  </div>

                  {/* Players List */}
                  <div className="space-y-2">
                    <h4 className="text-white font-semibold text-sm px-2">Squad</h4>
                    {getTeamPlayers(selectedTeam.id).length > 0 ? (
                      getTeamPlayers(selectedTeam.id).map((player) => (
                        <div
                          key={player.id}
                          className="bg-white/5 hover:bg-white/10 rounded-lg p-3 border border-white/10 transition-all duration-300"
                        >
                          <div className="flex items-start space-x-3">
                            {/* Player Image */}
                            <img
                              src={player.image}
                              alt={player.name}
                              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                              onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${player.name}&size=80&background=2d3748&color=fff`;
                              }}
                            />

                            {/* Player Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-white font-semibold text-sm">{player.name}</p>
                                  <p className="text-gray-400 text-xs">{player.role}</p>
                                </div>
                                <p className="text-green-400 font-bold text-sm flex-shrink-0">{(player.price || 0) / 100}Cr</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400 text-sm">No players bought yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </>
  );
};
