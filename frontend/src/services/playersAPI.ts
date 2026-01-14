/**
 * Players API Service
 */
import { API_ENDPOINTS, API_CONFIG } from '../config/api';

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

export const playersAPI = {
  /**
   * Get all players
   */
  async getAll(): Promise<Player[]> {
    try {
      const response = await fetch(API_ENDPOINTS.PLAYERS, {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
      });
      if (!response.ok) throw new Error('Failed to fetch players');
      const data = await response.json();
      return data.players;
    } catch (error) {
      console.error('Error fetching players:', error);
      throw error;
    }
  },

  /**
   * Get player by ID
   */
  async getById(id: number): Promise<Player> {
    try {
      const response = await fetch(API_ENDPOINTS.PLAYER(id), {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
      });
      if (!response.ok) throw new Error('Failed to fetch player');
      return await response.json();
    } catch (error) {
      console.error('Error fetching player:', error);
      throw error;
    }
  },

  /**
   * Sell player to a team
   */
  async sellPlayer(playerId: number, teamId: number, price: number): Promise<any> {
    try {
      const response = await fetch(API_ENDPOINTS.SELL_PLAYER(playerId), {
        method: 'PUT',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({ team_id: teamId, sold_price: price }),
      });
      if (!response.ok) throw new Error('Failed to sell player');
      return await response.json();
    } catch (error) {
      console.error('Error selling player:', error);
      throw error;
    }
  },

  /**
   * Mark player as unsold
   */
  async markUnsold(playerId: number): Promise<any> {
    try {
      const response = await fetch(API_ENDPOINTS.UNSOLD_PLAYER(playerId), {
        method: 'PUT',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({}),
      });
      if (!response.ok) throw new Error('Failed to mark player as unsold');
      return await response.json();
    } catch (error) {
      console.error('Error marking player as unsold:', error);
      throw error;
    }
  },
};

export default playersAPI;
