import { create } from 'zustand';
import { fetchFromBackend } from '../utils/api';

export interface Player {
  id: string;
  name: string;
  role: string;
  basePrice: number;
  sold: boolean;
  teamId?: string;
  price?: number;
  nationality: string;
  age: number;
  image: string;
  stats?: {
    matches?: number;
    runs?: number;
    wickets?: number;
    average?: number;
    strikeRate?: number;
    economy?: number;
  };
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  purse: number;
  logo: string;
  players: string[];
  color: string;
  primaryColor: string;
  secondaryColor: string;
  rank?: number;
  totalPoints?: number;
}

interface AuctionState {
  players: Player[];
  teams: Team[];
  currentIndex: number;
  currentPlayer: Player | null;
  auctionStarted: boolean;
  auctionPaused: boolean;
  currentBid: number;
  currentBidder: string | null;
  bidHistory: Array<{ teamId: string; amount: number; timestamp: number }>;
  lastBid?: { amount: number; teamId: string; teamName: string; timestamp: number };
  lastUpdate: number;

  // Hydration Actions
  setPlayers: (players: Player[]) => void;
  setTeams: (teams: Team[]) => void;
  updateState: (partial: Partial<AuctionState>) => void;
  fetchInitialData: () => Promise<void>;

  // Business Actions
  startAuction: () => void;
  pauseAuction: () => void;
  resumeAuction: () => void;
  nextPlayer: () => void;
  previousPlayer: () => void;
  setCurrentPlayer: (player: Player | null) => void;
  placeBid: (teamId: string, amount: number) => void;
  updateBidDisplay: (amount: number, teamId: string) => void;
  placeBidFromViewer: (bidAmount: number, teamId: string) => { success: boolean; message: string };
  getNextBidIncrement: (currentBid: number) => number;
  markSold: (playerId: string, teamId: string, price: number) => void;
  markUnsold: (playerId: string) => void;
  resetAuction: () => void;
  addPlayer: (player: Omit<Player, 'id'>) => void;
  removePlayer: (playerId: string) => void;
  updateTeamPurse: (teamId: string, amount: number) => void;
}

export const useAuctionStore = create<AuctionState>((set, get) => ({
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

  setPlayers: (players) => set({ players }),
  setTeams: (teams) => set({ teams }),
  updateState: (partial) => set((state) => ({ ...state, ...partial })),

  fetchInitialData: async () => {
    try {
      const [playersData, teamsData, stateData] = await Promise.all([
        fetchFromBackend('/players'),
        fetchFromBackend('/teams/leaderboard'),
        fetchFromBackend('/auction/state')
      ]);

      const players = playersData.map((p: any) => ({
        id: p.id,
        name: p.name,
        role: p.role,
        basePrice: parseFloat(p.base_price) / 100000, // Lakhs
        sold: p.is_sold,
        teamId: p.team_id,
        price: p.sold_price ? parseFloat(p.sold_price) / 100000 : undefined,
        nationality: p.nationality,
        age: p.age,
        image: p.image_url,
        stats: {
          matches: p.matches,
          runs: p.runs,
          wickets: p.wickets,
          average: p.average,
          strikeRate: p.strike_rate,
          economy: p.economy
        }
      }));

      const teams = teamsData.map((t: any) => ({
        id: t.id,
        name: t.name,
        shortName: t.code,
        purse: parseFloat(t.purse_balance) / 100000, // Lakhs
        logo: t.logo_url,
        players: [], // Will be filled if needed or derived
        color: t.color || '#000',
        primaryColor: t.primary_color || '#000',
        secondaryColor: t.secondary_color || '#fff',
        rank: t.rank,
        totalPoints: t.total_points
      }));

      set({
        players,
        teams,
        auctionStarted: stateData.status === 'ACTIVE',
        auctionPaused: stateData.status === 'PAUSED',
        currentBid: parseFloat(stateData.current_bid) / 100000,
        currentBidder: stateData.current_bidder_id,
        currentPlayer: players.find((p: any) => p.id === stateData.current_player_id) || null
      });
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
    }
  },

  startAuction: () => {
    const unsoldPlayers = get().players.filter(p => !p.sold);
    if (unsoldPlayers.length > 0) {
      set({
        auctionStarted: true,
        auctionPaused: false,
        currentIndex: 0,
        currentPlayer: unsoldPlayers[0],
        currentBid: 0,
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
        currentBid: 0,
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
        currentBid: 0,
        currentBidder: null,
        bidHistory: [],
      });
    }
  },

  setCurrentPlayer: (player) => {
    set({
      currentPlayer: player,
      currentBid: 0,
      currentBidder: null,
      bidHistory: [],
      lastUpdate: Date.now(),
    });
  },

  placeBid: (teamId, amount) => {
    const state = get();
    const team = state.teams.find(t => t.id === teamId);
    if (!team) return;

    set({
      currentBid: amount,
      currentBidder: teamId,
      bidHistory: [
        ...state.bidHistory,
        { teamId, amount, timestamp: Date.now() }
      ],
      lastUpdate: Date.now(),
    });
  },

  updateBidDisplay: (amount, teamId) => {
    const state = get();
    // If teamId is null, it's an admin adjustment, so we SHOULD clear the bidder
    const effectiveBidder = teamId === null ? null : (teamId || state.currentBidder);

    set({
      currentBid: amount,
      currentBidder: effectiveBidder,
      bidHistory: [
        ...state.bidHistory,
        { teamId: effectiveBidder || '', amount, timestamp: Date.now() }
      ],
      lastUpdate: Date.now(),
    });
  },

  getNextBidIncrement: (currentBid) => {
    const BID_INCREMENT_RULES = [
      { max: 100, increment: 5 },
      { max: 200, increment: 10 },
      { max: 500, increment: 20 },
      { max: 1000, increment: 25 },
      { max: Infinity, increment: 50 },
    ];
    const rule = BID_INCREMENT_RULES.find(rule => currentBid < rule.max);
    return rule ? rule.increment : 50;
  },

  placeBidFromViewer: (bidAmount, teamId) => {
    const state = get();
    if (!state.auctionStarted || !state.currentPlayer || state.currentPlayer.sold) {
      return { success: false, message: 'Cannot place bid at this time' };
    }

    const team = state.teams.find(t => t.id === teamId);
    if (!team) return { success: false, message: 'Team not found' };

    const minValidBid = state.currentBidder === null ? state.currentPlayer.basePrice : state.currentBid;

    if (bidAmount < minValidBid) {
      return { success: false, message: 'Bid too low' };
    }

    if (teamId === state.currentBidder) {
      return { success: false, message: 'Cannot bid consecutively' };
    }

    if (bidAmount > team.purse) {
      return { success: false, message: 'Exceeds purse' };
    }

    return { success: true, message: 'Bid placement pending...' };
  },

  markSold: (playerId, teamId, price) => {
    set(state => ({
      players: state.players.map(p =>
        p.id === playerId ? { ...p, sold: true, teamId, price } : p
      ),
      teams: state.teams.map(t =>
        t.id === teamId ? { ...t, purse: t.purse - price } : t
      ),
      currentBid: 0,
      currentBidder: null,
      bidHistory: [],
    }));
  },

  markUnsold: (playerId) => {
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
    // Should call backend reset
  },

  addPlayer: (_player) => {
    // Local add (ideally backend)
  },

  removePlayer: (playerId) => {
    set(state => ({
      players: state.players.filter(p => p.id !== playerId),
    }));
  },

  updateTeamPurse: (teamId, amount) => {
    set(state => ({
      teams: state.teams.map(t =>
        t.id === teamId ? { ...t, purse: amount } : t
      ),
    }));
  },
}));
