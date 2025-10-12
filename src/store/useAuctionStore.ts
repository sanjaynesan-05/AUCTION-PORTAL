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
  lastUpdate: number;

  startAuction: () => void;
  pauseAuction: () => void;
  resumeAuction: () => void;
  nextPlayer: () => void;
  previousPlayer: () => void;
  placeBid: (teamId: number, amount: number) => void;
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
        currentBid: unsoldPlayers[0].basePrice,
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
        currentBid: unsoldPlayers[nextIndex].basePrice,
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
        currentBid: unsoldPlayers[prevIndex].basePrice,
        currentBidder: null,
        bidHistory: [],
      });
    }
  },

  placeBid: (teamId: number, amount: number) => {
    const state = get();
    const team = state.teams.find(t => t.id === teamId);

    if (team && amount <= team.purse && amount > state.currentBid) {
      set({
        currentBid: amount,
        currentBidder: teamId,
        bidHistory: [
          ...state.bidHistory,
          { teamId, amount, timestamp: Date.now() }
        ],
      });
    }
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
