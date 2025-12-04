import { create } from 'zustand';
import { dataService, Player, Team } from '../services/dataService';

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

  startAuction: () => Promise<void>;
  pauseAuction: () => Promise<void>;
  resumeAuction: () => Promise<void>;
  nextPlayer: () => Promise<void>;
  previousPlayer: () => Promise<void>;
  placeBid: (teamId: number, amount: number) => Promise<void>;
  placeBidFromViewer: (bidAmount: number, teamId: number) => Promise<{ success: boolean; message: string }>;
  getNextBidIncrement: (currentBid: number) => number;
  markSold: (playerId: number, teamId: number, price: number) => Promise<void>;
  markUnsold: (playerId: number) => Promise<void>;
  resetAuction: () => Promise<void>;
  addPlayer: (player: Omit<Player, 'id'>) => Promise<void>;
  removePlayer: (playerId: number) => Promise<void>;
  updateTeamPurse: (teamId: number, amount: number) => Promise<void>;
}

export const useAuctionStore = create<AuctionState>((set, get) => {
  // Initialize store with empty state, then fetch data from API
  const initializeFromAPI = async () => {
    try {
      const players = await dataService.getPlayers();
      const teams = await dataService.getTeams();
      
      set({
        players: players || [],
        teams: teams || [],
        currentIndex: 0,
        currentPlayer: players && players.length > 0 ? players[0] : null,
        auctionStarted: false,
        auctionPaused: false,
        currentBid: 0,
        currentBidder: null,
        bidHistory: [],
        lastUpdate: Date.now(),
      });
    } catch (error) {
      console.error('Failed to initialize store from API:', error);
      // Fallback to empty state if API fails
      set({
        players: [],
        teams: [],
        currentIndex: 0,
        currentPlayer: null,
        auctionStarted: false,
        auctionPaused: false,
        currentBid: 0,
        currentBidder: null,
        bidHistory: [],
        lastUpdate: Date.now(),
      });
    }
  };

  // Call initialization immediately
  initializeFromAPI();

  return {
    players: [],
    teams: [],
    currentIndex: 0,
    currentPlayer: null,
    auctionStarted: false,
    auctionPaused: false,
    currentBid: 0,
    currentBidder: null,
    bidHistory: [],
    lastUpdate: Date.now(),

  startAuction: async () => {
    try {
      const result = await dataService.startAuction();
      if (result) {
        set({
          auctionStarted: true,
          auctionPaused: false,
          currentIndex: 0,
          currentPlayer: result.currentPlayer || null,
          currentBid: result.currentBid || 0,
          currentBidder: null,
          bidHistory: [],
          lastUpdate: Date.now(),
        });
      }
    } catch (error) {
      console.error('Failed to start auction:', error);
    }
  },

  pauseAuction: async () => {
    try {
      const result = await dataService.pauseAuction();
      if (result) {
        set({ auctionPaused: true, lastUpdate: Date.now() });
      }
    } catch (error) {
      console.error('Failed to pause auction:', error);
    }
  },

  resumeAuction: async () => {
    try {
      const result = await dataService.resumeAuction();
      if (result) {
        set({ auctionPaused: false, lastUpdate: Date.now() });
      }
    } catch (error) {
      console.error('Failed to resume auction:', error);
    }
  },

  nextPlayer: async () => {
    try {
      const result = await dataService.nextPlayer();
      if (result) {
        const state = get();
        const currentPlayerIndex = state.players.findIndex(p => p.id === result.currentPlayer?.id);
        set({
          currentIndex: currentPlayerIndex >= 0 ? currentPlayerIndex : state.currentIndex + 1,
          currentPlayer: result.currentPlayer || null,
          currentBid: result.currentBid || 0,
          currentBidder: null,
          bidHistory: [],
          lastUpdate: Date.now(),
        });
      }
    } catch (error) {
      console.error('Failed to move to next player:', error);
    }
  },

  previousPlayer: async () => {
    try {
      const result = await dataService.previousPlayer();
      if (result) {
        const state = get();
        const currentPlayerIndex = state.players.findIndex(p => p.id === result.currentPlayer?.id);
        set({
          currentIndex: Math.max(0, currentPlayerIndex >= 0 ? currentPlayerIndex : state.currentIndex - 1),
          currentPlayer: result.currentPlayer || null,
          currentBid: result.currentBid || 0,
          currentBidder: null,
          bidHistory: [],
          lastUpdate: Date.now(),
        });
      }
    } catch (error) {
      console.error('Failed to move to previous player:', error);
    }
  },

  placeBid: async (teamId: number, amount: number) => {
    try {
      const state = get();
      const currentPlayer = state.currentPlayer;
      if (!currentPlayer || !currentPlayer.id) return;

      const result = await dataService.placeBid(currentPlayer.id, teamId, amount);
      if (result) {
        set({
          currentBid: result.currentBid || amount,
          currentBidder: teamId,
          bidHistory: [
            ...state.bidHistory,
            { teamId, amount, timestamp: Date.now() }
          ],
          lastUpdate: Date.now(),
        });
      }
    } catch (error) {
      console.error('Failed to place bid:', error);
    }
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

  placeBidFromViewer: async (bidAmount: number, teamId: number) => {
    try {
      const state = get();
      if (!state.auctionStarted || !state.currentPlayer || !state.currentPlayer.id) {
        return { success: false, message: 'Cannot place bid at this time' };
      }

      const team = state.teams.find(t => t.id === teamId);
      if (!team) {
        return { success: false, message: 'Team not found' };
      }

      // First bid must be at or above base price
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

      // Call API to place bid
      const result = await dataService.placeBid(state.currentPlayer.id, teamId, bidAmount);
      
      if (result) {
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
      }
      
      return { success: false, message: 'Failed to place bid' };
    } catch (error) {
      console.error('Error placing bid:', error);
      return { success: false, message: 'Error placing bid' };
    }
  },

  markSold: async (playerId: number, teamId: number, price: number) => {
    try {
      const result = await dataService.markSold(playerId, teamId, price);
      if (result) {
        set(state => {
          const updatedPlayers = state.players.map(p =>
            p.id === playerId ? { ...p, sold: true, teamId, soldPrice: price, soldTo: state.teams.find(t => t.id === teamId)?.name } : p
          );

          const updatedTeams = state.teams.map(t =>
            t.id === teamId
              ? {
                  ...t,
                  purseRemaining: (t.purseRemaining || t.purse || 0) - price,
                }
              : t
          );

          return {
            players: updatedPlayers,
            teams: updatedTeams,
            currentBid: 0,
            currentBidder: null,
            bidHistory: [],
            lastUpdate: Date.now(),
          };
        });
      }
    } catch (error) {
      console.error('Failed to mark player sold:', error);
    }
  },

  markUnsold: async (playerId: number) => {
    try {
      const result = await dataService.markUnsold(playerId);
      if (result) {
        set(state => ({
          players: state.players.map(p =>
            p.id === playerId ? { ...p, status: 'unsold' } : p
          ),
          currentBid: 0,
          currentBidder: null,
          bidHistory: [],
          lastUpdate: Date.now(),
        }));
      }
    } catch (error) {
      console.error('Failed to mark player unsold:', error);
    }
  },

  resetAuction: async () => {
    try {
      const result = await dataService.resetAuction();
      if (result) {
        const players = await dataService.getPlayers();
        const teams = await dataService.getTeams();
        set({
          players: players || [],
          teams: teams || [],
          currentIndex: 0,
          currentPlayer: players && players.length > 0 ? players[0] : null,
          auctionStarted: false,
          auctionPaused: false,
          currentBid: 0,
          currentBidder: null,
          bidHistory: [],
        });
        // After an admin reset, automatically start the auction so presenter/viewer begin from first player
        try {
          await get().startAuction();
        } catch (err) {
          console.error('Failed to auto-start auction after reset:', err);
        }
      }
    } catch (error) {
      console.error('Failed to reset auction:', error);
    }
  },

  addPlayer: async (player: Omit<Player, 'id'>) => {
    try {
      const newPlayer = await dataService.createPlayer(player);
      if (newPlayer) {
        set(state => ({
          players: [...state.players, newPlayer],
        }));
      }
    } catch (error) {
      console.error('Failed to add player:', error);
    }
  },

  removePlayer: async (playerId: number) => {
    try {
      const success = await dataService.deletePlayer(playerId);
      if (success) {
        set(state => ({
          players: state.players.filter(p => p.id !== playerId),
        }));
      }
    } catch (error) {
      console.error('Failed to remove player:', error);
    }
  },

  updateTeamPurse: async (teamId: number, amount: number) => {
    try {
      const updatedTeam = await dataService.updateTeamPurse(teamId, amount);
      if (updatedTeam) {
        set(state => ({
          teams: state.teams.map(t =>
            t.id === teamId ? updatedTeam : t
          ),
        }));
      }
    } catch (error) {
      console.error('Failed to update team purse:', error);
    }
  },
  };
});
