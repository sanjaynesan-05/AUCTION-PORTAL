import { create } from 'zustand';
import { mockPlayers, Player } from '../data/mockPlayers';
import { mockTeams, Team } from '../data/mockTeams';

interface AuctionState {
  players: Player[];
  teams: Team[];
  currentIndex: number;
  currentPlayer: Player | null;
  auctionStarted: boolean;
  auctionPaused: boolean;
  currentBid: number;
  currentBidder: number | null;
  bidHistory: Array<{ teamId: number; amount: number; timestamp: number }>;
  lastBid?: { amount: number; teamId: number; teamName: string; timestamp: number };
  lastUpdate: number;

  startAuction: () => void;
  pauseAuction: () => void;
  resumeAuction: () => void;
  nextPlayer: () => void;
  previousPlayer: () => void;
  placeBid: (teamId: number, amount: number) => void;
  placeBidFromViewer: (bidAmount: number, teamId: number) => { success: boolean; message: string };
  getNextBidIncrement: (currentBid: number) => number;
  markSold: (playerId: number, teamId: number, price: number) => void;
  markUnsold: (playerId: number) => void;
  resetAuction: () => void;
  addPlayer: (player: Omit<Player, 'id'>) => void;
  removePlayer: (playerId: number) => void;
  updateTeamPurse: (teamId: number, amount: number) => void;
}

export const useAuctionStore = create<AuctionState>((set, get) => ({
  players: [...mockPlayers],
  teams: [...mockTeams],
  currentIndex: 0,
  currentPlayer: mockPlayers[0],
  auctionStarted: false,
  auctionPaused: false,
  currentBid: 0,
  currentBidder: null,
  bidHistory: [],
  lastUpdate: Date.now(),

  startAuction: () => {
    const unsoldPlayers = get().players.filter(p => !p.sold);
    if (unsoldPlayers.length > 0) {
      set({
        auctionStarted: true,
        auctionPaused: false,
        currentIndex: 0,
        currentPlayer: unsoldPlayers[0],
        currentBid: 0, // Reset to 0 - first bid will be at base price
        currentBidder: null,
        bidHistory: [],
      });
    }
  },

  pauseAuction: () => set({ auctionPaused: true }),

  resumeAuction: () => set({ auctionPaused: false }),

  nextPlayer: () => {
    const state = get();
    const unsoldPlayers = state.players.filter(p => !p.sold);
    const nextIndex = state.currentIndex + 1;

    if (nextIndex < unsoldPlayers.length) {
      set({
        currentIndex: nextIndex,
        currentPlayer: unsoldPlayers[nextIndex],
        currentBid: 0, // Reset to 0 - first bid will be at base price
        currentBidder: null,
        bidHistory: [],
      });
    } else {
      set({
        currentPlayer: null,
        auctionStarted: false,
        currentBid: 0,
        currentBidder: null,
        bidHistory: [],
      });
    }
  },

  previousPlayer: () => {
    const state = get();
    const unsoldPlayers = state.players.filter(p => !p.sold);
    const prevIndex = Math.max(0, state.currentIndex - 1);

    if (prevIndex >= 0 && unsoldPlayers[prevIndex]) {
      set({
        currentIndex: prevIndex,
        currentPlayer: unsoldPlayers[prevIndex],
        currentBid: 0, // Reset to 0 - first bid will be at base price
        currentBidder: null,
        bidHistory: [],
      });
    }
  },

  placeBid: (teamId: number, amount: number) => {
    const state = get();
    const team = state.teams.find(t => t.id === teamId);
    const currentPlayer = state.currentPlayer;

    if (!team || !currentPlayer) return;

    // Check if team has enough purse
    if (amount > team.purse) {
      return;
    }

    // First bid must be at or above base price
    // Subsequent bids must be higher than current bid
    const minValidBid = state.currentBidder === null ? currentPlayer.basePrice : state.currentBid;
    
    if (amount < minValidBid) {
      return;
    }

    // Prevent consecutive bids from the same team
    if (teamId === state.currentBidder) {
      return;
    }

    set({
      currentBid: amount,
      currentBidder: teamId,
      bidHistory: [
        ...state.bidHistory,
        { teamId, amount, timestamp: Date.now() }
      ],
    });
  },

  // Add increment rules
  getNextBidIncrement: (currentBid: number) => {
    const BID_INCREMENT_RULES = [
      { max: 10000000, increment: 500000 }, // 0-1 crore: 5 lakh
      { max: 20000000, increment: 1000000 }, // 1-2 crore: 10 lakh
      { max: 30000000, increment: 2000000 }, // 2-3 crore: 20 lakh
      { max: 50000000, increment: 2500000 }, // 3-5 crore: 25 lakh
      { max: Infinity, increment: 5000000 }, // 5+ crore: 50 lakh
    ];

    const rule = BID_INCREMENT_RULES.find(rule => currentBid < rule.max);
    return rule ? rule.increment : 5000000;
  },

  // Add viewer bidding function
  placeBidFromViewer: (bidAmount: number, teamId: number) => {
    const state = get();
    if (!state.auctionStarted || !state.currentPlayer || state.currentPlayer.sold) {
      return { success: false, message: 'Cannot place bid at this time' };
    }

    const team = state.teams.find(t => t.id === teamId);
    if (!team) {
      return { success: false, message: 'Team not found' };
    }

    // First bid must be at or above base price
    // Subsequent bids must be higher than current bid
    const minValidBid = state.currentBidder === null ? state.currentPlayer.basePrice : state.currentBid;
    
    if (bidAmount < minValidBid) {
      const isFirstBid = state.currentBidder === null;
      return { 
        success: false, 
        message: isFirstBid 
          ? `First bid must be at least ₹${state.currentPlayer.basePrice}L (base price)` 
          : `Bid must be higher than current bid of ₹${state.currentBid}L` 
      };
    }

    // Prevent consecutive bids from the same team
    if (teamId === state.currentBidder) {
      return { success: false, message: 'Cannot bid consecutively from the same team' };
    }

    if (bidAmount > team.purse) {
      return { success: false, message: 'Bid exceeds team purse' };
    }

    // Update bid
    const newBid = {
      amount: bidAmount,
      teamId,
      teamName: team.name,
      timestamp: Date.now(),
    };

    set({
      currentBid: bidAmount,
      currentBidder: teamId,
      lastBid: newBid,
      bidHistory: [...state.bidHistory, newBid],
      lastUpdate: Date.now(),
    });

    return { success: true, message: 'Bid placed successfully' };
  },

  markSold: (playerId: number, teamId: number, price: number) => {
    set(state => {
      const updatedPlayers = state.players.map(p =>
        p.id === playerId ? { ...p, sold: true, teamId, price } : p
      );

      const updatedTeams = state.teams.map(t =>
        t.id === teamId
          ? {
              ...t,
              purse: t.purse - price,
              players: [...t.players, playerId]
            }
          : t
      );

      return {
        players: updatedPlayers,
        teams: updatedTeams,
        currentBid: 0,
        currentBidder: null,
        bidHistory: [],
      };
    });
  },

  markUnsold: (playerId: number) => {
    set(state => ({
      players: state.players.map(p =>
        p.id === playerId ? { ...p, sold: true, teamId: undefined, price: 0 } : p
      ),
      currentBid: 0,
      currentBidder: null,
      bidHistory: [],
    }));
  },

  resetAuction: () => {
    set({
      players: mockPlayers.map(p => ({ ...p, sold: false, teamId: undefined, price: undefined })),
      teams: mockTeams.map(t => ({ ...t, purse: 1000, players: [] })),
      currentIndex: 0,
      currentPlayer: mockPlayers[0],
      auctionStarted: false,
      auctionPaused: false,
      currentBid: 0,
      currentBidder: null,
      bidHistory: [],
    });
  },

  addPlayer: (player: Omit<Player, 'id'>) => {
    set(state => {
      const newId = Math.max(...state.players.map(p => p.id), 0) + 1;
      return {
        players: [...state.players, { ...player, id: newId }],
      };
    });
  },

  removePlayer: (playerId: number) => {
    set(state => ({
      players: state.players.filter(p => p.id !== playerId),
    }));
  },

  updateTeamPurse: (teamId: number, amount: number) => {
    set(state => ({
      teams: state.teams.map(t =>
        t.id === teamId ? { ...t, purse: amount } : t
      ),
    }));
  },
}));
