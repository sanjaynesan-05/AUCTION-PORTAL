/**
 * API Configuration for Frontend-Backend Integration
 * Base URL: http://localhost:8000 (development)
 * For production, set API_BASE_URL environment variable
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  WS_URL: WS_BASE_URL,
  
  // Authentication endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
  },
  
  // Player management endpoints
  PLAYERS: {
    LIST: `${API_BASE_URL}/players`,
    GET: (id: number) => `${API_BASE_URL}/players/${id}`,
    CREATE: `${API_BASE_URL}/players`,
    UPDATE: (id: number) => `${API_BASE_URL}/players/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/players/${id}`,
  },
  
  // Team management endpoints
  TEAMS: {
    LIST: `${API_BASE_URL}/teams`,
    GET: (id: number) => `${API_BASE_URL}/teams/${id}`,
    UPDATE_PURSE: (id: number) => `${API_BASE_URL}/teams/${id}/purse`,
  },
  
  // Auction endpoints
  AUCTION: {
    GET_STATE: `${API_BASE_URL}/auction/state`,
    START: `${API_BASE_URL}/auction/start`,
    PAUSE: `${API_BASE_URL}/auction/pause`,
    RESUME: `${API_BASE_URL}/auction/resume`,
    NEXT_PLAYER: `${API_BASE_URL}/auction/next`,
    PREVIOUS_PLAYER: `${API_BASE_URL}/auction/previous`,
    PLACE_BID: `${API_BASE_URL}/auction/bid`,
    MARK_SOLD: `${API_BASE_URL}/auction/mark-sold`,
    MARK_UNSOLD: `${API_BASE_URL}/auction/mark-unsold`,
    RESET: `${API_BASE_URL}/auction/reset`,
  },
  
  // WebSocket endpoints
  WEBSOCKET: {
    AUCTION: `${WS_BASE_URL}/ws/auction`,
  },
  
  // Health check
  HEALTH: `${API_BASE_URL}/health`,
  ROOT: `${API_BASE_URL}/`,
};

/**
 * API Client with error handling
 */
export class APIClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.loadToken();
  }

  /**
   * Load token from localStorage
   */
  private loadToken(): void {
    this.token = localStorage.getItem('access_token');
  }

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  /**
   * Clear authentication token
   */
  clearToken(): void {
    this.token = null;
    localStorage.removeItem('access_token');
  }

  /**
   * Get request headers
   */
  private getHeaders(contentType = 'application/json'): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': contentType,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Perform GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`GET ${endpoint} failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Perform POST request
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`POST ${endpoint} failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Perform PUT request
   */
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`PUT ${endpoint} failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Perform DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`DELETE ${endpoint} failed: ${response.statusText}`);
    }

    return response.json();
  }
}

export const apiClient = new APIClient();
