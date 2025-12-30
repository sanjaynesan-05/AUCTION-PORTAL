/**
 * Presenter Panel - Read-Only Fullscreen Display
 * 
 * Features:
 * - WebSocket-only real-time updates
 * - Fullscreen display for presentation/broadcasting
 * - NO mutations (completely read-only)
 * - Auto-reconnect on disconnect
 * - Smooth animations
 */
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { Gavel, Trophy, TrendingUp, LogOut } from 'lucide-react';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

interface Player {
  id: number;
  name: string;
  role: string;
  basePrice: number;
  nationality: string;
  age: number;
  image: string;
  stats?: string;
}

interface Team {
  id: number;
  name: string;
  color: string;
}

interface AuctionState {
  status: 'IDLE' | 'LIVE' | 'SOLD';
  currentBid: number;
  currentPlayer: Player | null;
  winningTeam: Team | null;
  lastUpdate?: number;
}

export default function PresenterPanel() {
  const navigate = useNavigate();
  const { logout, user } = useRole();
  const [auctionState, setAuctionState] = useState<AuctionState>({
    status: 'IDLE',
    currentBid: 0,
    currentPlayer: null,
    winningTeam: null
  });
  
  const [isConnected, setIsConnected] = useState(false);
  const [previousBid, setPreviousBid] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    connectWebSocket();
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket(`${WS_URL}/ws/auction`);
      
      ws.onopen = () => {
        console.log('[WebSocket] Connected');
        setIsConnected(true);
      };
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'auction_state_update' && message.data) {
            const newState = message.data;
            
            // Track bid changes for animation
            if (newState.currentBid !== auctionState.currentBid) {
              setPreviousBid(auctionState.currentBid);
            }
            
            setAuctionState(newState);
          }
        } catch (error) {
          console.error('[WebSocket] Error parsing message:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
      };
      
      ws.onclose = () => {
        console.log('[WebSocket] Disconnected');
        setIsConnected(false);
        
        // Auto-reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('[WebSocket] Reconnecting...');
          connectWebSocket();
        }, 3000);
      };
      
      wsRef.current = ws;
    } catch (error) {
      console.error('[WebSocket] Connection error:', error);
      setIsConnected(false);
      
      // Retry connection after 3 seconds
      reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
    }
  };

  const getStatusColor = () => {
    switch (auctionState.status) {
      case 'IDLE':
        return 'from-yellow-500 to-orange-500';
      case 'LIVE':
        return 'from-green-500 to-emerald-500';
      case 'SOLD':
        return 'from-blue-500 to-indigo-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusText = () => {
    switch (auctionState.status) {
      case 'IDLE':
        return 'READY TO START';
      case 'LIVE':
        return 'LIVE AUCTION';
      case 'SOLD':
        return 'SOLD!';
      default:
        return 'WAITING...';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Connection Status */}
      <div className={`fixed top-4 right-4 px-4 py-2 rounded-full text-sm font-semibold z-50 ${
        isConnected ? 'bg-green-500' : 'bg-red-500'
      } text-white flex items-center shadow-lg`}>
        <span className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-white animate-pulse' : 'bg-white/50'}`}></span>
        {isConnected ? 'LIVE' : 'RECONNECTING...'}
      </div>

      {/* Header */}
      <div className="bg-black/40 backdrop-blur-lg border-b border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                <Gavel className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">IPL Auction 2025</h1>
                <p className="text-lg text-gray-300">🎙️ Presenter Mode (Read-Only Display)</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Status Badge */}
              <div className={`px-8 py-4 rounded-2xl bg-gradient-to-r ${getStatusColor()} text-white text-2xl font-bold ${
                auctionState.status === 'LIVE' ? 'animate-pulse' : ''
              }`}>
                {getStatusText()}
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        {auctionState.currentPlayer ? (
          <div className="w-full max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Player Card */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="flex flex-col items-center">
                  <div className="relative mb-6">
                    <img
                      src={auctionState.currentPlayer.image}
                      alt={auctionState.currentPlayer.name}
                      className="w-48 h-48 rounded-full border-8 border-white/30 shadow-2xl object-cover"
                    />
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-sm">
                      {auctionState.currentPlayer.role}
                    </div>
                  </div>
                  
                  <h2 className="text-4xl font-bold text-white text-center mb-2">
                    {auctionState.currentPlayer.name}
                  </h2>
                  
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="px-4 py-2 bg-white/20 rounded-lg text-white">
                      {auctionState.currentPlayer.nationality}
                    </span>
                    <span className="px-4 py-2 bg-white/20 rounded-lg text-white">
                      {auctionState.currentPlayer.age} years
                    </span>
                  </div>

                  <div className="w-full bg-white/10 rounded-xl p-4 mb-4">
                    <p className="text-gray-400 text-sm mb-1">Base Price</p>
                    <p className="text-white text-3xl font-bold">₹{auctionState.currentPlayer.basePrice}L</p>
                  </div>

                  {auctionState.currentPlayer.stats && (
                    <div className="w-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-4 border border-purple-500/30">
                      <p className="text-purple-200 text-sm font-semibold mb-2">Career Stats</p>
                      <p className="text-white text-sm">{auctionState.currentPlayer.stats}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bid Display */}
              <div className="flex flex-col justify-center space-y-6">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-12 text-center shadow-2xl transform transition-all duration-500 hover:scale-105">
                  <div className="flex items-center justify-center mb-4">
                    <TrendingUp className="w-12 h-12 text-white mr-4" />
                    <p className="text-white text-2xl font-bold">CURRENT BID</p>
                  </div>
                  
                  <p className={`text-white font-bold mb-4 transition-all duration-500 ${
                    auctionState.currentBid !== previousBid ? 'text-8xl scale-110' : 'text-8xl'
                  }`}>
                    ₹{auctionState.currentBid}L
                  </p>
                  
                  {previousBid > 0 && auctionState.currentBid > previousBid && (
                    <div className="flex items-center justify-center text-white text-xl animate-bounce">
                      <TrendingUp className="w-6 h-6 mr-2" />
                      <span>+₹{auctionState.currentBid - previousBid}L</span>
                    </div>
                  )}
                </div>

                {/* Winning Team Display */}
                {auctionState.status === 'SOLD' && auctionState.winningTeam && (
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center shadow-2xl animate-pulse"
                  >
                    <div className="flex items-center justify-center mb-4">
                      <Trophy className="w-12 h-12 text-yellow-400 mr-4" />
                      <p className="text-white text-2xl font-bold">SOLD TO</p>
                    </div>
                    
                    <p className="text-white text-5xl font-bold mb-2">
                      {auctionState.winningTeam.name}
                    </p>
                    
                    <div className="flex items-center justify-center mt-6">
                      <div 
                        className="w-20 h-20 rounded-full border-4 border-white shadow-xl"
                        style={{ backgroundColor: auctionState.winningTeam.color }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <Gavel className="w-16 h-16 text-white animate-pulse" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Waiting for Next Player</h2>
            <p className="text-xl text-gray-400">The auction will begin shortly</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-black/40 backdrop-blur-lg border-t border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-center text-gray-400 text-sm">
            🔴 Live Broadcast • Powered by WebSocket Real-Time Technology
          </p>
        </div>
      </div>
    </div>
  );
}
