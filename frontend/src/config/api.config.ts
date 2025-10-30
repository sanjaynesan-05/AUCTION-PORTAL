// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

export const config = {
  apiUrl: API_URL,
  wsUrl: WS_URL,
  endpoints: {
    auth: {
      login: `${API_URL}/api/auth/login`,
      register: `${API_URL}/api/auth/register`,
      verify: `${API_URL}/api/auth/verify`,
    },
    players: {
      base: `${API_URL}/api/players`,
      byId: (id: string) => `${API_URL}/api/players/${id}`,
    },
    teams: {
      base: `${API_URL}/api/teams`,
      byId: (id: string) => `${API_URL}/api/teams/${id}`,
      myTeam: `${API_URL}/api/teams/my-team`,
    },
    analytics: {
      overview: `${API_URL}/api/analytics/overview`,
      players: `${API_URL}/api/analytics/players`,
      teams: `${API_URL}/api/analytics/teams`,
    },
  },
};

export default config;
