import { create } from 'zustand';
import { dataService, Player, Team } from '../services/dataService';

interface AuctionState {
  players: Player[];
  teams: Team[];
  currentPlayer: Player | null;
  lastUpdate: number;

  loadPlayers: () => Promise<void>;
  loadTeams: () => Promise<void>;
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
        currentPlayer: null,
        lastUpdate: Date.now(),
      });
    } catch (error) {
      console.error('Failed to initialize store from API:', error);
      set({
        players: [],
        teams: [],
        currentPlayer: null,
        lastUpdate: Date.now(),
      });
    }
  };

  // Call initialization immediately
  initializeFromAPI();

  return {
    players: [],
    teams: [],
    currentPlayer: null,
    lastUpdate: Date.now(),

    loadPlayers: async () => {
      try {
        const players = await dataService.getPlayers();
        set({ players: players || [], lastUpdate: Date.now() });
      } catch (error) {
        console.error('Failed to load players:', error);
      }
    },

    loadTeams: async () => {
      try {
        const teams = await dataService.getTeams();
        set({ teams: teams || [], lastUpdate: Date.now() });
      } catch (error) {
        console.error('Failed to load teams:', error);
      }
    },
  };
});

