import { apiClient } from './apiClient';

export interface Player {
  id?: number;
  name: string;
  role: string;
  basePrice: number;
  image?: string;
  team?: string;
  soldPrice?: number;
  soldTo?: string;
  status?: 'available' | 'sold' | 'unsold';
}

export interface Team {
  id?: number;
  name: string;
  shortName: string;
  color: string;
  logo?: string;
  purchasedPlayers?: Player[];
  purseRemaining: number;
}

export interface AuctionState {
  auctionId?: number;
  currentPlayer?: Player;
  currentBid?: number;
  currentBidder?: string;
  status: 'idle' | 'ongoing' | 'paused' | 'completed';
  totalPlayers?: number;
  playersProcessed?: number;
  purchasedCount?: number;
  unsoldCount?: number;
  timeRemaining?: number;
  teams?: Team[];
}

export interface User {
  id?: number;
  username: string;
  role: 'admin' | 'presenter' | 'viewer' | 'team';
  teamName?: string;
  email?: string;
}

class DataService {
  /**
   * Fetch all players from backend
   */
  async getPlayers(): Promise<Player[]> {
    try {
      const response = await apiClient.get<Player[]>('/players');
      return response || [];
    } catch (error) {
      console.error('Failed to fetch players:', error);
      return [];
    }
  }

  /**
   * Fetch a single player by ID
   */
  async getPlayer(id: number): Promise<Player | null> {
    try {
      const response = await apiClient.get<Player>(`/players/${id}`);
      return response || null;
    } catch (error) {
      console.error(`Failed to fetch player ${id}:`, error);
      return null;
    }
  }

  /**
   * Create a new player
   */
  async createPlayer(player: Omit<Player, 'id'>): Promise<Player | null> {
    try {
      const response = await apiClient.post<Player>('/players', player);
      return response || null;
    } catch (error) {
      console.error('Failed to create player:', error);
      return null;
    }
  }

  /**
   * Update a player
   */
  async updatePlayer(id: number, player: Partial<Player>): Promise<Player | null> {
    try {
      const response = await apiClient.put<Player>(`/players/${id}`, player);
      return response || null;
    } catch (error) {
      console.error(`Failed to update player ${id}:`, error);
      return null;
    }
  }

  /**
   * Delete a player
   */
  async deletePlayer(id: number): Promise<boolean> {
    try {
      await apiClient.delete(`/players/${id}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete player ${id}:`, error);
      return false;
    }
  }

  /**
   * Fetch all teams from backend
   */
  async getTeams(): Promise<Team[]> {
    try {
      const response = await apiClient.get<Team[]>('/teams');
      return response || [];
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      return [];
    }
  }

  /**
   * Fetch a single team by ID
   */
  async getTeam(id: number): Promise<Team | null> {
    try {
      const response = await apiClient.get<Team>(`/teams/${id}`);
      return response || null;
    } catch (error) {
      console.error(`Failed to fetch team ${id}:`, error);
      return null;
    }
  }

  /**
   * Update team purse
   */
  async updateTeamPurse(id: number, newPurse: number): Promise<Team | null> {
    try {
      const response = await apiClient.put<Team>(`/teams/${id}/purse`, { purse: newPurse });
      return response || null;
    } catch (error) {
      console.error(`Failed to update team ${id} purse:`, error);
      return null;
    }
  }

  /**
   * Get current auction state
   */
  async getAuctionState(): Promise<AuctionState | null> {
    try {
      const response = await apiClient.get<AuctionState>('/auction/state');
      return response || null;
    } catch (error) {
      console.error('Failed to fetch auction state:', error);
      return null;
    }
  }

  /**
   * Start auction
   */
  async startAuction(): Promise<AuctionState | null> {
    try {
      const response = await apiClient.post<any>('/auction/start', {});
      return response?.state || response || null;
    } catch (error) {
      console.error('Failed to start auction:', error);
      return null;
    }
  }

  /**
   * Pause auction
   */
  async pauseAuction(): Promise<AuctionState | null> {
    try {
      const response = await apiClient.post<any>('/auction/pause', {});
      return response?.state || response || null;
    } catch (error) {
      console.error('Failed to pause auction:', error);
      return null;
    }
  }

  /**
   * Resume auction
   */
  async resumeAuction(): Promise<AuctionState | null> {
    try {
      const response = await apiClient.post<any>('/auction/resume', {});
      return response?.state || response || null;
    } catch (error) {
      console.error('Failed to resume auction:', error);
      return null;
    }
  }

  /**
   * Move to next player
   */
  async nextPlayer(): Promise<AuctionState | null> {
    try {
      const response = await apiClient.post<any>('/auction/next', {});
      return response?.state || response || null;
    } catch (error) {
      console.error('Failed to move to next player:', error);
      return null;
    }
  }

  /**
   * Move to previous player
   */
  async previousPlayer(): Promise<AuctionState | null> {
    try {
      const response = await apiClient.post<any>('/auction/previous', {});
      return response?.state || response || null;
    } catch (error) {
      console.error('Failed to move to previous player:', error);
      return null;
    }
  }

  /**
   * Place a bid on a player
   */
  async placeBid(playerId: number, teamId: number, bidAmount: number): Promise<AuctionState | null> {
    try {
      const response = await apiClient.post<any>('/auction/bid', {
        player_id: playerId,
        team_id: teamId,
        bid_amount: bidAmount,
      });
      return response?.state || response || null;
    } catch (error) {
      console.error('Failed to place bid:', error);
      return null;
    }
  }

  /**
   * Mark player as sold
   */
  async markSold(playerId: number, teamId: number, finalPrice: number): Promise<AuctionState | null> {
    try {
      const response = await apiClient.post<any>('/auction/mark-sold', {
        player_id: playerId,
        team_id: teamId,
        final_price: finalPrice,
      });
      return response?.state || response || null;
    } catch (error) {
      console.error('Failed to mark player sold:', error);
      return null;
    }
  }

  /**
   * Mark player as unsold
   */
  async markUnsold(playerId: number): Promise<AuctionState | null> {
    try {
      const response = await apiClient.post<any>('/auction/mark-unsold', {
        player_id: playerId,
      });
      return response?.state || response || null;
    } catch (error) {
      console.error('Failed to mark player unsold:', error);
      return null;
    }
  }

  /**
   * Reset auction
   */
  async resetAuction(): Promise<AuctionState | null> {
    try {
      const response = await apiClient.post<any>('/auction/reset', {});
      return response?.state || response || null;
    } catch (error) {
      console.error('Failed to reset auction:', error);
      return null;
    }
  }

  /**
   * Get all users (admin only)
   */
  async getUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<User[]>('/users');
      return response || [];
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return [];
    }
  }

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<User>('/auth/me');
      return response || null;
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      return null;
    }
  }

  /**
   * Authenticate user
   */
  async login(username: string, password: string): Promise<{ access_token: string; user: User } | null> {
    try {
      const response = await apiClient.post<{ access_token: string; user: User }>('/auth/login', {
        username,
        password,
      });
      return response || null;
    } catch (error) {
      console.error('Failed to login:', error);
      return null;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<boolean> {
    try {
      await apiClient.post('/auth/logout', {});
      return true;
    } catch (error) {
      console.error('Failed to logout:', error);
      return false;
    }
  }
}

export const dataService = new DataService();
