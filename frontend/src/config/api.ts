/**
 * API Configuration
 * Backend service URLs
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Health
  HEALTH: `${API_BASE_URL}/api/health`,

  // Teams
  TEAMS: `${API_BASE_URL}/api/teams`,
  TEAM: (id: number) => `${API_BASE_URL}/api/teams/${id}`,
  TEAM_SQUAD: (id: number) => `${API_BASE_URL}/api/teams/${id}/squad`,
  UPDATE_TEAM_PURSE: (id: number) => `${API_BASE_URL}/api/teams/${id}/purse`,

  // Players
  PLAYERS: `${API_BASE_URL}/api/players`,
  PLAYER: (id: number) => `${API_BASE_URL}/api/players/${id}`,
  SELL_PLAYER: (id: number) => `${API_BASE_URL}/api/players/${id}/sell`,
  UNSOLD_PLAYER: (id: number) => `${API_BASE_URL}/api/players/${id}/unsold`,

  // Auction
  AUCTION_STATUS: `${API_BASE_URL}/api/auction/status`,
  START_AUCTION: `${API_BASE_URL}/api/auction/start`,
  END_AUCTION: `${API_BASE_URL}/api/auction/end`,
  PLACE_BID: `${API_BASE_URL}/api/auction/bid`,
  MARK_SOLD: `${API_BASE_URL}/api/auction/sold`,
  MARK_UNSOLD: `${API_BASE_URL}/api/auction/unsold`,
};

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export default API_ENDPOINTS;
