/**
 * Teams API Service
 */
import { API_ENDPOINTS, API_CONFIG } from '../config/api';

interface Team {
  id: number;
  name: string;
  shortName: string;
  logo: string;
  color: string;
  purse: number;
  totalPurse: number;
}

interface Player {
  id: number;
  name: string;
  role: string;
  price: number;
  image: string;
}

export const teamsAPI = {
  /**
   * Get all teams
   */
  async getAll(): Promise<Team[]> {
    try {
      const response = await fetch(API_ENDPOINTS.TEAMS, {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
      });
      if (!response.ok) throw new Error('Failed to fetch teams');
      const data = await response.json();
      return data.teams;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  },

  /**
   * Get team by ID
   */
  async getById(id: number): Promise<Team> {
    try {
      const response = await fetch(API_ENDPOINTS.TEAM(id), {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
      });
      if (!response.ok) throw new Error('Failed to fetch team');
      return await response.json();
    } catch (error) {
      console.error('Error fetching team:', error);
      throw error;
    }
  },

  /**
   * Get team squad (players)
   */
  async getSquad(id: number): Promise<Player[]> {
    try {
      const response = await fetch(API_ENDPOINTS.TEAM_SQUAD(id), {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
      });
      if (!response.ok) throw new Error('Failed to fetch team squad');
      const data = await response.json();
      return data.players;
    } catch (error) {
      console.error('Error fetching team squad:', error);
      throw error;
    }
  },

  /**
   * Update team purse
   */
  async updatePurse(id: number, amount: number): Promise<any> {
    try {
      const response = await fetch(API_ENDPOINTS.UPDATE_TEAM_PURSE(id), {
        method: 'PUT',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({ amount }),
      });
      if (!response.ok) throw new Error('Failed to update purse');
      return await response.json();
    } catch (error) {
      console.error('Error updating purse:', error);
      throw error;
    }
  },
};

export default teamsAPI;
