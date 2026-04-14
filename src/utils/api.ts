const API_BASE_URL = 'https://auction-portal-1.onrender.com/api';

export async function fetchFromBackend(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
}

export const socketUrl = 'wss://auction-portal-1.onrender.com/ws';


export interface BackendPlayer {
    id: string;
    name: string;
    role: string;
    nationality: string;
    age: number;
    image: string;
    is_sold: boolean;
    team_id: string | null;
    set_number: number;
    set_name: string;
}

export interface BackendTeam {
    id: string;
    name: string;
    code: string;
    logo_url: string;
    color: string;
    primary_color: string;
    secondary_color: string;
    purse_balance: number;
    total_points: number;
    players_count: number;
}

export interface AuctionState {
    status: string;
    current_player_id: string | null;
    current_bid: number;
    current_bidder_id: string | null;
    remaining_players_count: number;
}
