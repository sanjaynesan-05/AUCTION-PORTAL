import { X } from 'lucide-react';
import { Player, Team } from '../services/dataService';

interface SoldModalProps {
  isOpen: boolean;
  player: Player | null;
  team: Team | null;
  soldAmount: number;
  onClose: () => void;
}

export default function SoldModal({
  isOpen,
  player,
  team,
  soldAmount,
  onClose,
}: SoldModalProps) {
  if (!isOpen) return null;
  
  // If modal is open but missing player, don't render
  if (!player) {
    console.warn('SoldModal: Missing player data', { player, team, soldAmount });
    return null;
  }
  
  // If team is missing, create a fallback
  const displayTeam = team || { name: 'Unknown Team', shortName: 'UNK', logo: null };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-green-900 via-slate-900 to-green-900 rounded-2xl border border-green-500/30 max-w-md w-full mx-4 shadow-2xl transform transition-all animate-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Success Indicator */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500/50 mb-4">
              <div className="text-3xl">✓</div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Player Sold!</h2>
          </div>

          {/* Player Info */}
          <div className="mb-6">
            <img
              src={player.image}
              alt={player.name}
              className="w-24 h-24 rounded-lg border-2 border-green-400/50 mx-auto mb-4 object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${player.name}&background=16a34a&color=fff&size=96`;
              }}
            />
            <h3 className="text-2xl font-bold text-white mb-2">{player.name}</h3>
            <p className="text-green-300 font-semibold">
              ₹{soldAmount}L
            </p>
          </div>

          {/* Team Info */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 mb-6">
            <p className="text-sm text-gray-300 mb-3">Sold to</p>
            <div className="flex items-center justify-center space-x-3">
              {displayTeam.logo && (
                <img
                  src={displayTeam.logo}
                  alt={displayTeam.name}
                  className="w-12 h-12 rounded-lg object-contain bg-white/10 p-1"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${displayTeam.name}&background=ffffff&color=000&size=48`;
                  }}
                />
              )}
              <div className="text-left">
                <p className="text-white font-bold">{displayTeam.name}</p>
                <p className="text-xs text-gray-400">{displayTeam.shortName}</p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Next Player
          </button>
        </div>
      </div>
    </div>
  );
}
