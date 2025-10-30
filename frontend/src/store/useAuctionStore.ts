import { create } from 'zustand';
import { playersApi, teamsApi, Player as ApiPlayer, Team as ApiTeam } from '../services/api.service';
import wsService from '../services/websocket.service';

export interface Player {
  id: string;
  name: string;
  role: string;
  basePrice: number;
  nationality: string;
  age: number;
  battingStyle?: string;
  bowlingStyle?: string;
  stats?: {
    matches: number;
    runs: number;
    wickets: number;
    average: number;
    strikeRate: number;
  };
  sold: boolean;
  teamId?: string;
  price?: number;
  image?: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
  logo?: string;
  purse: number;
  players?: string[];
}

interface AuctionState {
  players: Player[];
  teams: Team[];
  currentPlayer: Player | null;
  auctionStarted: boolean;
  auctionPaused: boolean;
  currentBid: number;
  currentBidder: string | null;
  bidHistory: Array<{ teamId: string; amount: number; timestamp: number; teamName?: string }>;
  lastBid?: { amount: number; teamId: string; teamName: string; timestamp: number };
  lastUpdate: number;
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;
  loadPlayers: () => Promise<void>;
  loadTeams: () => Promise<void>;
  initializeData: () => Promise<void>;
  connectWebSocket: () => Promise<void>;
  disconnectWebSocket: () => void;
  startAuction: () => void;
  pauseAuction: () => void;
  resumeAuction: () => void;
  nextPlayer: () => void;
  previousPlayer: () => void;
  setCurrentPlayer: (playerId: string) => void;
  markSold: (playerId: string, teamId: string, price: number) => void;
  markUnsold: (playerId: string) => void;
  endAuction: () => void;
  resetAuction: () => void;
  placeBid: (amount: number) => { success: boolean; message: string };
  getNextBidIncrement: (currentBid: number) => number;
  updateAuctionState: (state: Partial<AuctionState>) => void;
}
export const useAuctionStore = create<AuctionState>((set, get) => ({
  players: [],
  teams: [],
  currentPlayer: null,
  auctionStarted: false,
  auctionPaused: false,
  currentBid: 0,
  currentBidder: null,
  bidHistory: [],
  lastUpdate: Date.now(),
  isLoading: false,
  isConnected: false,
  error: null,

  loadPlayers: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await playersApi.getAll();
      console.log('API Response:', response); // Debug log
      const players: Player[] = response.data.map((p: ApiPlayer) => ({
        id: p.id,
        name: p.name,
        role: p.role,
        basePrice: p.basePrice,
        nationality: p.nationality,
        age: p.age,
        battingStyle: p.battingStyle,
        bowlingStyle: p.bowlingStyle,
        stats: p.stats,
        sold: p.sold,
        teamId: p.soldTo,
        price: p.soldPrice,
        image: '',
      }));
      set({ players, isLoading: false });
      console.log('Players loaded:', players.length);
    } catch (error: any) {
      console.error('Failed to load players:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  loadTeams: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await teamsApi.getAll();
      console.log('Teams API Response:', response); // Debug log
      const teams: Team[] = response.data.map((t: ApiTeam) => ({
        id: t.id,
        name: t.name,
        shortName: t.shortName,
        color: t.color,
        logo: t.logo,
        purse: t.purse,
        players: [],
      }));
      set({ teams, isLoading: false });
      console.log('Teams loaded:', teams.length);
    } catch (error: any) {
      console.error('Failed to load teams:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  initializeData: async () => {
    await Promise.all([get().loadPlayers(), get().loadTeams()]);
  },
  connectWebSocket: async () => {
    try {
      console.log('Connecting to WebSocket...');
      await wsService.connect();
      set({ isConnected: true });
      console.log('WebSocket connected');

      wsService.onAuctionStarted((data) => {
        console.log('Auction started', data);
        set({
          auctionStarted: true,
          auctionPaused: false,
          currentPlayer: data.currentPlayer,
          currentBid: 0,
          currentBidder: null,
          bidHistory: [],
          lastUpdate: Date.now(),
        });
      });

      wsService.onAuctionPaused((data) => {
        console.log('Auction paused', data);
        set({ auctionPaused: true, lastUpdate: Date.now() });
      });

      wsService.onAuctionResumed((data) => {
        console.log('Auction resumed', data);
        set({ auctionPaused: false, lastUpdate: Date.now() });
      });

      wsService.onAuctionEnded((data) => {
        console.log('Auction ended', data);
        set({
          auctionStarted: false,
          auctionPaused: false,
          currentPlayer: null,
          currentBid: 0,
          currentBidder: null,
          bidHistory: [],
          lastUpdate: Date.now(),
        });
      });

      wsService.onPlayerRevealed((data) => {
        console.log('Player revealed', data);
        set({
          currentPlayer: data.player,
          currentBid: 0,
          currentBidder: null,
          bidHistory: [],
          lastUpdate: Date.now(),
        });
      });

      wsService.onBidPlaced((data) => {
        console.log('Bid placed', data);
        const state = get();
        const team = state.teams.find(t => t.id === data.teamId);
        const newBid = {
          amount: data.amount,
          teamId: data.teamId,
          teamName: team?.name || data.teamName || 'Unknown Team',
          timestamp: Date.now(),
        };
        set({
          currentBid: data.amount,
          currentBidder: data.teamId,
          lastBid: newBid,
          bidHistory: [...state.bidHistory, newBid],
          lastUpdate: Date.now(),
        });
      });
      wsService.onPlayerSold((data) => {
        console.log('Player sold', data);
        const state = get();
        const updatedPlayers = state.players.map(p =>
          p.id === data.playerId
            ? { ...p, sold: true, teamId: data.teamId, price: data.price }
            : p
        );
        const updatedTeams = state.teams.map(t =>
          t.id === data.teamId
            ? { ...t, purse: t.purse - data.price }
            : t
        );
        set({
          players: updatedPlayers,
          teams: updatedTeams,
          currentBid: 0,
          currentBidder: null,
          bidHistory: [],
          lastUpdate: Date.now(),
        });
      });

      wsService.onPlayerUnsold((data) => {
        console.log('Player unsold', data);
        const state = get();
        const updatedPlayers = state.players.map(p =>
          p.id === data.playerId
            ? { ...p, sold: true, teamId: undefined, price: 0 }
            : p
        );
        set({
          players: updatedPlayers,
          currentBid: 0,
          currentBidder: null,
          bidHistory: [],
          lastUpdate: Date.now(),
        });
      });

      wsService.onAuctionStateUpdate((data) => {
        console.log('Auction state update', data);
        set({
          auctionStarted: data.started,
          auctionPaused: data.paused,
          currentPlayer: data.currentPlayer,
          currentBid: data.currentBid,
          currentBidder: data.currentBidder,
          bidHistory: data.bidHistory || [],
          lastUpdate: Date.now(),
        });
      });
    } catch (error: any) {
      console.error('WebSocket connection failed:', error);
      set({ isConnected: false, error: error.message });
    }
  },

  disconnectWebSocket: () => {
    wsService.removeAllListeners();
    wsService.disconnect();
    set({ isConnected: false });
    console.log('WebSocket disconnected');
  },
  startAuction: () => {
    console.log('Starting auction');
    wsService.startAuction();
  },

  pauseAuction: () => {
    console.log('Pausing auction');
    wsService.pauseAuction();
  },

  resumeAuction: () => {
    console.log('Resuming auction');
    wsService.resumeAuction();
  },

  nextPlayer: () => {
    console.log('Next player');
    wsService.nextPlayer();
  },

  previousPlayer: () => {
    console.log('Previous player');
    wsService.previousPlayer();
  },

  setCurrentPlayer: (playerId: string) => {
    console.log('Setting current player:', playerId);
    wsService.setCurrentPlayer(playerId);
  },

  markSold: (playerId: string, teamId: string, price: number) => {
    console.log('Marking player as sold:', { playerId, teamId, price });
    wsService.markSold(playerId, teamId, price);
  },

  markUnsold: (playerId: string) => {
    console.log('Marking player as unsold:', playerId);
    wsService.markUnsold(playerId);
  },

  endAuction: () => {
    console.log('Ending auction');
    wsService.endAuction();
  },

  resetAuction: () => {
    console.log('Resetting auction');
    wsService.resetAuction();
  },
  placeBid: (amount: number) => {
    const state = get();
    if (!state.auctionStarted) {
      return { success: false, message: 'Auction has not started' };
    }
    if (state.auctionPaused) {
      return { success: false, message: 'Auction is paused' };
    }
    if (!state.currentPlayer) {
      return { success: false, message: 'No player available for bidding' };
    }
    if (state.currentPlayer.sold) {
      return { success: false, message: 'Player already sold' };
    }
    const minValidBid = state.currentBidder === null 
      ? state.currentPlayer.basePrice 
      : state.currentBid + get().getNextBidIncrement(state.currentBid);
    if (amount < minValidBid) {
      const isFirstBid = state.currentBidder === null;
      return { 
        success: false, 
        message: isFirstBid 
          ? `First bid must be at least ?${state.currentPlayer.basePrice}L (base price)` 
          : `Bid must be at least ?${minValidBid}L (current: ?${state.currentBid}L)` 
      };
    }
    console.log('Placing bid:', amount);
    wsService.placeBid(amount);
    return { success: true, message: 'Bid placed successfully' };
  },

  getNextBidIncrement: (currentBid: number) => {
    const BID_INCREMENT_RULES = [
      { max: 100, increment: 5 },
      { max: 200, increment: 10 },
      { max: 300, increment: 20 },
      { max: 500, increment: 25 },
      { max: Infinity, increment: 50 },
    ];
    const rule = BID_INCREMENT_RULES.find(rule => currentBid < rule.max);
    return rule ? rule.increment : 50;
  },

  updateAuctionState: (updates: Partial<AuctionState>) => {
    set({ ...updates, lastUpdate: Date.now() });
  },
}));

export const useInitializeAuction = () => {
  const store = useAuctionStore();
  const initialize = async () => {
    await store.initializeData();
    await store.connectWebSocket();
  };
  return { initialize, ...store };
};
