interface SoldUnsoldModalProps {
  playerName: string;
  playerImage: string;
  teamName?: string;
  teamLogo?: string;
  price?: number;
  unsold?: boolean;
}

export default function SoldUnsoldModal({
  playerName,
  playerImage,
  teamName,
  teamLogo,
  price,
  unsold = false
}: SoldUnsoldModalProps) {
  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm ${
      unsold ? 'bg-red-900/50' : 'bg-black/50'
    }`}>
      {/* Minimalist Modal - Simple & Clean */}
      <div className="relative mx-4 w-full max-w-xs modal-sold-container">
        <div className={`rounded-2xl p-6 shadow-2xl backdrop-blur-md border relative ${
          unsold 
            ? 'bg-red-950/80 border-red-400/40'
            : 'bg-slate-900/80 border-yellow-400/40'
        }`}>
          
          {/* Player Image Circle - Completely Clean */}
          <div className="relative mx-auto w-44 h-44 mb-4 flex-shrink-0">
            {/* Clean Player Image - Completely Unobstructed */}
            <img
              src={playerImage || `https://ui-avatars.com/api/?name=${playerName}&size=400&background=2d3748&color=fff`}
              alt={playerName}
              className={`w-full h-full rounded-full object-cover border-4 ${
                unsold ? 'border-red-400/60' : 'border-yellow-400/60'
              }`}
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${playerName}&size=400&background=2d3748&color=fff`;
              }}
            />
            
            {/* Team Logo Badge - Bottom Right (Only for Sold) */}
            {!unsold && teamLogo && (
              <div className="absolute bottom-0 right-0 w-14 h-14 bg-white/10 backdrop-blur-lg rounded-full border-2 border-yellow-400/80 flex items-center justify-center transform translate-x-2 translate-y-2">
                <img
                  src={teamLogo}
                  alt={teamName}
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${teamName}&size=80&background=1e293b`;
                  }}
                />
              </div>
            )}
          </div>

          {/* Stamp - Top Right Corner, Outside Modal */}
          <div className="absolute -top-6 -right-6 stamp-animation pointer-events-none">
            {unsold ? (
              <div className="text-3xl md:text-4xl font-black text-red-500 opacity-95 transform -rotate-12 border-4 border-red-500 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm whitespace-nowrap shadow-lg">
                UNSOLD
              </div>
            ) : (
              <div className="text-3xl md:text-4xl font-black text-green-400 opacity-95 transform -rotate-12 border-4 border-green-400 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm whitespace-nowrap shadow-lg">
                SOLD
              </div>
            )}
          </div>

          {/* Player Name */}
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
            {playerName}
          </h2>

          {/* Status Text */}
          <p className={`text-center font-semibold mb-4 text-sm ${
            unsold ? 'text-red-400' : 'text-yellow-400'
          }`}>
            {unsold ? 'Player Not Sold' : teamName}
          </p>

          {/* Amount - Only for Sold */}
          {!unsold && price !== undefined && (
            <div className="text-center pb-2">
              <p className="text-3xl md:text-4xl font-bold text-green-400">
                ₹{price}L
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
