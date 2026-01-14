/**
 * Zustand store with API integration for auction data
 */
import { create } from 'zustand';
import teamsAPI from '../services/teamsAPI';
import playersAPI from '../services/playersAPI';
import auctionAPI from '../services/auctionAPI';

export interface Team {
  id: number;
  name: string;
  shortName: string;
  logo: string;
  color: string;
  purse: number;
  totalPurse: number;
}

export interface Player {
  id: number;
  name: string;
  role: string;
  nationality: string;
  age: number;
  basePrice: number;
  imageUrl: string;
  stats: {
    matches: number;
    runs: number;
    wickets: number;
    average: number;
    strikeRate: number;
  };
  teamId?: number;
  sold: boolean;
  soldPrice?: number;
}

interface AuctionAPIState {
  // Data
  teams: Team[];
  players: Player[];
  currentPlayer: Player | null;
  currentBid: number;
  currentBidder: number | null;

  // Status
  isLoading: boolean;
  error: string | null;
  auctionStarted: boolean;
  currentIndex: number;

  // Bid history
  bidHistory: Array<{ teamId: number; amount: number; timestamp: number }>;

  // Actions
  initializeAuction: () => Promise<void>;
  loadTeams: () => Promise<void>;
  loadPlayers: () => Promise<void>;
  startAuction: () => Promise<void>;
  endAuction: () => Promise<void>;
  nextPlayer: () => void;
  previousPlayer: () => void;
  placeBid: (teamId: number, amount: number) => Promise<void>;
  markSold: (playerId: number, teamId: number, price: number) => Promise<void>;
  markUnsold: (playerId: number) => Promise<void>;
  refreshAuctionStatus: () => Promise<void>;
}

export const useAuctionAPI = create<AuctionAPIState>((set, get) => ({
  // Initial state
  teams: [],
  players: [],
  currentPlayer: null,
  currentBid: 0,
  currentBidder: null,
  isLoading: false,
  error: null,
  auctionStarted: false,
  currentIndex: 0,
  bidHistory: [],

  // Load teams from API
  loadTeams: async () => {
    try {
      set({ isLoading: true, error: null });
      const teams = await teamsAPI.getAll();
      set({ teams });
    } catch (error) {
      set({ error: 'Failed to load teams' });
      console.error('Error loading teams:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Load players from API
  loadPlayers: async () => {
    try {
      set({ isLoading: true, error: null });
      const players = await playersAPI.getAll();
      set({ players });
    } catch (error) {
      set({ error: 'Failed to load players' });
      console.error('Error loading players:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Initialize auction - load all data
  initializeAuction: async () => {
    try {
      set({ isLoading: true, error: null });
      await Promise.all([
        get().loadTeams(),
        get().loadPlayers(),
      ]);
      
      // Set first unsold player as current
      const unsoldPlayers = get().players.filter(p => !p.sold);
      if (unsoldPlayers.length > 0) {
        set({
          currentPlayer: unsoldPlayers[0],
          currentIndex: 0,
        });
      }
    } catch (error) {
      set({ error: 'Failed to initialize auction' });
      console.error('Error initializing auction:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Start auction
  startAuction: async () => {
    try {
      set({ isLoading: true, error: null });
      await auctionAPI.start();
      
      const unsoldPlayers = get().players.filter(p => !p.sold);
      if (unsoldPlayers.length > 0) {
        set({
          auctionStarted: true,
          currentPlayer: unsoldPlayers[0],
          currentIndex: 0,
          currentBid: 0,
          currentBidder: null,
          bidHistory: [],
        });
      }
    } catch (error) {
      set({ error: 'Failed to start auction' });
      console.error('Error starting auction:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // End auction
  endAuction: async () => {
    try {
      set({ isLoading: true, error: null });
      await auctionAPI.end();
      set({
        auctionStarted: false,
        currentPlayer: null,
        currentBid: 0,
        currentBidder: null,
      });
    } catch (error) {
      set({ error: 'Failed to end auction' });
      console.error('Error ending auction:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Move to next player
  nextPlayer: () => {
    const state = get();
    const unsoldPlayers = state.players.filter(p => !p.sold);
    const nextIndex = state.currentIndex + 1;

    if (nextIndex < unsoldPlayers.length) {
      set({
        currentIndex: nextIndex,
        currentPlayer: unsoldPlayers[nextIndex],
        currentBid: 0,
        currentBidder: null,
        bidHistory: [],
      });
    } else {
      set({
        auctionStarted: false,
        currentPlayer: null,
      });
    }
  },

  // Move to previous player
  previousPlayer: () => {
    const state = get();
    const unsoldPlayers = state.players.filter(p => !p.sold);
    const prevIndex = Math.max(0, state.currentIndex - 1);

    if (prevIndex >= 0 && unsoldPlayers[prevIndex]) {
      set({
        currentIndex: prevIndex,
        currentPlayer: unsoldPlayers[prevIndex],
        currentBid: 0,
        currentBidder: null,
        bidHistory: [],
      });
    }
  },

  // Place a bid
  placeBid: async (teamId: number, amount: number) => {
    try {
      const currentPlayer = get().currentPlayer;
      if (!currentPlayer) {
        throw new Error('No player selected');
      }

      await auctionAPI.placeBid({
        playerId: currentPlayer.id,
        teamId,
        bidAmount: amount,
      });

      set({
        currentBid: amount,
        currentBidder: teamId,
        bidHistory: [...get().bidHistory, { teamId, amount, timestamp: Date.now() }],
      });
    } catch (error) {
      set({ error: 'Failed to place bid' });
      console.error('Error placing bid:', error);
    }
  },

  // Mark player as sold
  markSold: async (playerId: number, teamId: number, price: number) => {
    try {
      set({ isLoading: true, error: null });
      await auctionAPI.markSold(playerId, teamId, price);

      // Update players list
      const updatedPlayers = get().players.map(p =>
        p.id === playerId ? { ...p, sold: true, soldPrice: price, teamId } : p
      );
      set({ players: updatedPlayers });

      // Move to next player
      get().nextPlayer();
    } catch (error) {
      set({ error: 'Failed to mark player as sold' });
      console.error('Error marking player as sold:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Mark player as unsold
  markUnsold: async (playerId: number) => {
    try {
      set({ isLoading: true, error: null });
      await auctionAPI.markUnsold(playerId);

      // Update players list
      const updatedPlayers = get().players.map(p =>
        p.id === playerId ? { ...p, sold: false, soldPrice: undefined } : p
      );
      set({ players: updatedPlayers });
    } catch (error) {
      set({ error: 'Failed to mark player as unsold' });
      console.error('Error marking player as unsold:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Refresh auction status from server
  refreshAuctionStatus: async () => {
    try {
      const status = await auctionAPI.getStatus();
      set({
        auctionStarted: status.isActive,
        currentBid: status.currentBid || 0,
        currentBidder: status.currentHighestBidderId || null,
      });
    } catch (error) {
      console.error('Error refreshing auction status:', error);
    }
  },
}));

export default useAuctionAPI;
