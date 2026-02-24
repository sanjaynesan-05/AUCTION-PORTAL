const API_BASE_URL = 'http://localhost:8000/api';

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

export const socketUrl = 'ws://localhost:8000/ws';


export interface BackendPlayer {
    id: string;
    name: string;
    role: string;
    nationality: string;
    age: number;
    matches: number;
    runs: number;
    wickets: number;
    average: number;
    strike_rate: number;
    economy: number;
    base_price: number;
    sold_price: number | null;
    is_sold: boolean;
    image_url: string;
    points: number;
    team_id: string | null;
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
