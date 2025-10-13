import React, { useState } from 'react';
import { Users, X } from 'lucide-react';

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
}

export const FloatingTeamPurse: React.FC<FloatingTeamPurseProps> = ({ teams }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortedTeams = teams.sort((a, b) => b.purse - a.purse);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
      >
        <Users className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 m-4 max-w-md w-full max-h-[80vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Team Purse Status</h3>
                  <p className="text-sm text-gray-400">Remaining budget overview</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Team List */}
            <div className="space-y-3">
              {sortedTeams.map((team, idx) => (
                <div 
                  key={team.id} 
                  className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {/* Rank Badge */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      idx === 0 ? 'bg-yellow-500 text-black' : 
                      idx === 1 ? 'bg-gray-400 text-black' : 
                      idx === 2 ? 'bg-amber-600 text-white' : 
                      'bg-white/20 text-gray-300'
                    }`}>
                      {idx + 1}
                    </div>

                    {/* Team Info */}
                    <img
                      src={team.logo}
                      alt={team.name}
                      className="w-10 h-10"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${team.shortName}&background=${team.color.slice(1)}&color=fff&size=40`;
                      }}
                    />
                    <div>
                      <p className="text-white font-semibold text-sm">{team.shortName}</p>
                      <p className="text-gray-400 text-xs">{team.name}</p>
                    </div>
                  </div>

                  {/* Purse Amount */}
                  <div className="text-right">
                    <p className="text-white font-bold">₹{(team.purse / 100).toFixed(1)}Cr</p>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      team.purse > 2000 ? 'bg-green-500/20 text-green-400' :
                      team.purse > 1000 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {team.purse > 2000 ? 'Strong' : team.purse > 1000 ? 'Moderate' : 'Limited'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Stats */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-500/30">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-gray-400 text-xs">Highest Budget</p>
                  <p className="text-green-400 font-bold">₹{(sortedTeams[0]?.purse / 100).toFixed(1)}Cr</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Lowest Budget</p>
                  <p className="text-red-400 font-bold">₹{(sortedTeams[sortedTeams.length - 1]?.purse / 100).toFixed(1)}Cr</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};