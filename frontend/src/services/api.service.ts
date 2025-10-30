import config from '../config/api.config';

// Token management
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

// HTTP request helper
interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { requiresAuth = true, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(endpoint, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

// Auth API
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      username: string;
      role: 'admin' | 'presenter' | 'viewer';
      teamId?: string;
    };
  };
}

export interface RegisterData {
  username: string;
  password: string;
  role: 'admin' | 'presenter' | 'viewer';
  teamId?: string;
}

export interface VerifyResponse {
  user: {
    id: string;
    username: string;
    role: 'admin' | 'presenter' | 'viewer';
    teamId?: string;
  };
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>(config.endpoints.auth.login, {
      method: 'POST',
      body: JSON.stringify(credentials),
      requiresAuth: false,
    });
  },

  register: async (data: RegisterData): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>(config.endpoints.auth.register, {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth: false,
    });
  },

  verify: async (): Promise<VerifyResponse> => {
    return apiRequest<VerifyResponse>(config.endpoints.auth.verify, {
      method: 'GET',
      requiresAuth: true,
    });
  },
};

// Players API
export interface Player {
  id: string;
  name: string;
  role: string;
  basePrice: number;
  nationality: string;
  age: number;
  battingStyle?: string;
  bowlingStyle?: string;
  stats?: {
    matches: number;
    runs: number;
    wickets: number;
    average: number;
    strikeRate: number;
  };
  sold: boolean;
  soldTo?: string;
  soldPrice?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlayersResponse {
  success: boolean;
  count: number;
  data: Player[];
  teamRestricted?: boolean;
}

export interface PlayerResponse {
  success: boolean;
  data: Player;
  message?: string;
}

export const playersApi = {
  getAll: async (): Promise<PlayersResponse> => {
    return apiRequest<PlayersResponse>(config.endpoints.players.base, {
      method: 'GET',
    });
  },

  getById: async (id: string): Promise<PlayerResponse> => {
    return apiRequest<PlayerResponse>(config.endpoints.players.byId(id), {
      method: 'GET',
    });
  },

  create: async (player: Partial<Player>): Promise<PlayerResponse> => {
    return apiRequest<PlayerResponse>(config.endpoints.players.base, {
      method: 'POST',
      body: JSON.stringify(player),
    });
  },

  update: async (id: string, player: Partial<Player>): Promise<PlayerResponse> => {
    return apiRequest<PlayerResponse>(config.endpoints.players.byId(id), {
      method: 'PUT',
      body: JSON.stringify(player),
    });
  },

  delete: async (id: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(config.endpoints.players.byId(id), {
      method: 'DELETE',
    });
  },
};

// Teams API
export interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
  logo?: string;
  purse: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamsResponse {
  success: boolean;
  count: number;
  data: Team[];
  teamRestricted?: boolean;
}

export interface TeamResponse {
  success: boolean;
  data: Team;
  message?: string;
}

export const teamsApi = {
  getAll: async (): Promise<TeamsResponse> => {
    return apiRequest<TeamsResponse>(config.endpoints.teams.base, {
      method: 'GET',
    });
  },

  getById: async (id: string): Promise<TeamResponse> => {
    return apiRequest<TeamResponse>(config.endpoints.teams.byId(id), {
      method: 'GET',
    });
  },

  getMyTeam: async (): Promise<TeamResponse> => {
    return apiRequest<TeamResponse>(config.endpoints.teams.myTeam, {
      method: 'GET',
    });
  },

  update: async (id: string, team: Partial<Team>): Promise<TeamResponse> => {
    return apiRequest<TeamResponse>(config.endpoints.teams.byId(id), {
      method: 'PUT',
      body: JSON.stringify(team),
    });
  },
};

export default {
  auth: authApi,
  players: playersApi,
  teams: teamsApi,
  analytics: {
    getOverview: async (): Promise<any> => {
      return apiRequest<any>(config.endpoints.analytics.overview, {
        method: 'GET',
      });
    },

    getPlayers: async (): Promise<any> => {
      return apiRequest<any>(config.endpoints.analytics.players, {
        method: 'GET',
      });
    },

    getTeams: async (): Promise<any> => {
      return apiRequest<any>(config.endpoints.analytics.teams, {
        method: 'GET',
      });
    },
  },
};
