import React, { useState } from 'react';
import { DollarSign, X, TrendingDown, TrendingUp, ChevronRight } from 'lucide-react';

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
  const maxPurse = Math.max(...teams.map(t => t.purse));

  // Get players for a specific team
  const getTeamPlayers = (teamId: number): Player[] => {
    return players.filter(p => p.teamId === teamId && p.sold);
  };

  // Calculate total spent by a team
  const getTotalSpent = (teamId: number): number => {
    return getTeamPlayers(teamId).reduce((total, player) => total + (player.price || 0), 0);
  };

  const handleTeamClick = (team: Team) => {
    setSelectedTeam(selectedTeam?.id === team.id ? null : team);
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
          
          {/* Main Panel */}
          <div className="fixed bottom-24 right-6 left-6 md:left-auto z-50 md:w-96 max-w-[calc(100vw-3rem)] bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl animate-slide-up max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">
                    {selectedTeam ? `${selectedTeam.name} Squad` : 'Team Purse'}
                  </h3>
                  <p className="text-gray-400 text-xs">
                    {selectedTeam ? `${getTeamPlayers(selectedTeam.id).length} Players Bought` : 'Remaining Budget'}
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
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Content - Teams List or Team Details */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {!selectedTeam ? (
                // Teams List View
                <div className="p-4 space-y-3">
                  {sortedTeams.map((team, index) => {
                    const pursePercentage = (team.purse / maxPurse) * 100;
                    const isLow = pursePercentage < 30;
                    const isMedium = pursePercentage >= 30 && pursePercentage < 60;
                    const teamPlayers = getTeamPlayers(team.id);
                    
                    return (
                      <div
                        key={team.id}
                        onClick={() => handleTeamClick(team)}
                        className="bg-white/5 hover:bg-white/10 rounded-xl p-3 transition-all duration-300 border border-white/10 hover:border-white/20 cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3 flex-1">
                            {/* Rank Badge */}
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                              index === 0 ? 'bg-yellow-400 text-black' :
                              index === 1 ? 'bg-gray-300 text-black' :
                              index === 2 ? 'bg-orange-400 text-black' :
                              'bg-white/20 text-white'
                            }`}>
                              {index + 1}
                            </div>
                            
                            {/* Team Logo */}
                            <img
                              src={team.logo}
                              alt={team.name}
                              className="w-8 h-8 flex-shrink-0"
                              onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${team.shortName}&background=${team.color.slice(1)}&color=fff&size=32`;
                              }}
                            />
                            
                            {/* Team Name */}
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-semibold text-sm">{team.shortName}</p>
                              <p className="text-gray-400 text-xs">{team.name}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 flex-shrink-0">
                            {/* Players Count */}
                            <div className="text-right">
                              <p className="text-white font-semibold text-sm">{teamPlayers.length}</p>
                              <p className="text-gray-400 text-xs">Players</p>
                            </div>

                            {/* Purse Amount */}
                            <div className="text-right">
                              <p className={`text-lg font-black ${
                                isLow ? 'text-red-400' :
                                isMedium ? 'text-yellow-400' :
                                'text-green-400'
                              }`}>
                                ₹{(team.purse / 100).toFixed(1)}Cr
                              </p>
                              <div className="flex items-center justify-end space-x-1">
                                {isLow ? (
                                  <TrendingDown className="w-3 h-3 text-red-400" />
                                ) : (
                                  <TrendingUp className="w-3 h-3 text-green-400" />
                                )}
                                <span className="text-xs text-gray-400">{pursePercentage.toFixed(0)}%</span>
                              </div>
                            </div>

                            {/* Chevron */}
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors flex-shrink-0" />
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isLow ? 'bg-gradient-to-r from-red-500 to-red-600' :
                              isMedium ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                              'bg-gradient-to-r from-green-500 to-emerald-500'
                            }`}
                            style={{ width: `${pursePercentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Team Details View - Players Bought
                <div className="p-4 space-y-3">
                  {/* Team Summary */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center space-x-3 mb-4">
                      <img
                        src={selectedTeam.logo}
                        alt={selectedTeam.name}
                        className="w-12 h-12"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${selectedTeam.shortName}&background=${selectedTeam.color.slice(1)}&color=fff&size=48`;
                        }}
                      />
                      <div>
                        <h3 className="text-white font-bold text-lg">{selectedTeam.name}</h3>
                        <p className="text-gray-400 text-sm">{selectedTeam.shortName}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Purse Left</p>
                        <p className="text-green-400 font-bold text-lg">₹{(selectedTeam.purse / 100).toFixed(1)}Cr</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Total Spent</p>
                        <p className="text-yellow-400 font-bold text-lg">₹{(getTotalSpent(selectedTeam.id) / 100).toFixed(1)}Cr</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Players</p>
                        <p className="text-blue-400 font-bold text-lg">{getTeamPlayers(selectedTeam.id).length}</p>
                      </div>
                    </div>
                  </div>

                  {/* Players List */}
                  <div className="space-y-2">
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
                                <p className="text-green-400 font-bold text-sm flex-shrink-0">₹{(player.price || 0) / 100}Cr</p>
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
