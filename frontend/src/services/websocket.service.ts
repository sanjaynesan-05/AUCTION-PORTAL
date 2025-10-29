import { io, Socket } from 'socket.io-client';
import config from '../config/api.config';
import { getToken } from './api.service';

export interface AuctionState {
  started: boolean;
  paused: boolean;
  currentPlayer: any;
  currentBid: number;
  currentBidder: string | null;
  bidHistory: Array<{
    teamId: string;
    amount: number;
    timestamp: number;
  }>;
}

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(): Promise<Socket> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve(this.socket);
        return;
      }

      const token = getToken();
      if (!token) {
        reject(new Error('No authentication token found'));
        return;
      }

      this.socket = io(config.wsUrl, {
        auth: { token },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      this.socket.on('connect', () => {
        console.log('✅ WebSocket connected');
        this.isConnected = true;
        resolve(this.socket!);
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ WebSocket connection error:', error);
        this.isConnected = false;
        reject(error);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('🔌 WebSocket disconnected:', reason);
        this.isConnected = false;
      });

      this.socket.on('error', (error) => {
        console.error('❌ WebSocket error:', error);
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Presenter Events (emit)
  startAuction(): void {
    this.socket?.emit('start-auction');
  }

  pauseAuction(): void {
    this.socket?.emit('pause-auction');
  }

  resumeAuction(): void {
    this.socket?.emit('resume-auction');
  }

  nextPlayer(): void {
    this.socket?.emit('next-player');
  }

  previousPlayer(): void {
    this.socket?.emit('previous-player');
  }

  setCurrentPlayer(playerId: string): void {
    this.socket?.emit('set-current-player', { playerId });
  }

  markSold(playerId: string, teamId: string, price: number): void {
    this.socket?.emit('mark-sold', { playerId, teamId, price });
  }

  markUnsold(playerId: string): void {
    this.socket?.emit('mark-unsold', { playerId });
  }

  endAuction(): void {
    this.socket?.emit('end-auction');
  }

  resetAuction(): void {
    this.socket?.emit('reset-auction');
  }

  // Viewer Events (emit)
  placeBid(amount: number): void {
    this.socket?.emit('place-bid', { amount });
  }

  // Listen for server events
  onAuctionStarted(callback: (data: any) => void): void {
    this.socket?.on('auction-started', callback);
  }

  onAuctionPaused(callback: (data: any) => void): void {
    this.socket?.on('auction-paused', callback);
  }

  onAuctionResumed(callback: (data: any) => void): void {
    this.socket?.on('auction-resumed', callback);
  }

  onAuctionEnded(callback: (data: any) => void): void {
    this.socket?.on('auction-ended', callback);
  }

  onPlayerRevealed(callback: (data: any) => void): void {
    this.socket?.on('player-revealed', callback);
  }

  onBidPlaced(callback: (data: any) => void): void {
    this.socket?.on('bid-placed', callback);
  }

  onPlayerSold(callback: (data: any) => void): void {
    this.socket?.on('player-sold', callback);
  }

  onPlayerUnsold(callback: (data: any) => void): void {
    this.socket?.on('player-unsold', callback);
  }

  onAuctionStateUpdate(callback: (data: AuctionState) => void): void {
    this.socket?.on('auction-state-update', callback);
  }

  // Remove listeners
  offAuctionStarted(callback?: (data: any) => void): void {
    this.socket?.off('auction-started', callback);
  }

  offAuctionPaused(callback?: (data: any) => void): void {
    this.socket?.off('auction-paused', callback);
  }

  offAuctionResumed(callback?: (data: any) => void): void {
    this.socket?.off('auction-resumed', callback);
  }

  offAuctionEnded(callback?: (data: any) => void): void {
    this.socket?.off('auction-ended', callback);
  }

  offPlayerRevealed(callback?: (data: any) => void): void {
    this.socket?.off('player-revealed', callback);
  }

  offBidPlaced(callback?: (data: any) => void): void {
    this.socket?.off('bid-placed', callback);
  }

  offPlayerSold(callback?: (data: any) => void): void {
    this.socket?.off('player-sold', callback);
  }

  offPlayerUnsold(callback?: (data: any) => void): void {
    this.socket?.off('player-unsold', callback);
  }

  offAuctionStateUpdate(callback?: (data: AuctionState) => void): void {
    this.socket?.off('auction-state-update', callback);
  }

  // Remove all listeners
  removeAllListeners(): void {
    this.socket?.removeAllListeners();
  }
}

// Export singleton instance
export const wsService = new WebSocketService();
export default wsService;
