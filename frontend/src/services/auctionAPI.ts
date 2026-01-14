/**
 * Auction API Service
 */
import { API_ENDPOINTS, API_CONFIG } from '../config/api';

export interface AuctionStatus {
  id: number;
  currentPlayerId: number;
  isActive: boolean;
  currentBid: number;
  currentHighestBidderId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Bid {
  playerId: number;
  teamId: number;
  bidAmount: number;
}

export const auctionAPI = {
  /**
   * Get current auction status
   */
  async getStatus(): Promise<AuctionStatus> {
    try {
      const response = await fetch(API_ENDPOINTS.AUCTION_STATUS, {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
      });
      if (!response.ok) throw new Error('Failed to fetch auction status');
      return await response.json();
    } catch (error) {
      console.error('Error fetching auction status:', error);
      throw error;
    }
  },

  /**
   * Start auction
   */
  async start(): Promise<any> {
    try {
      const response = await fetch(API_ENDPOINTS.START_AUCTION, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({}),
      });
      if (!response.ok) throw new Error('Failed to start auction');
      return await response.json();
    } catch (error) {
      console.error('Error starting auction:', error);
      throw error;
    }
  },

  /**
   * End auction
   */
  async end(): Promise<any> {
    try {
      const response = await fetch(API_ENDPOINTS.END_AUCTION, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({}),
      });
      if (!response.ok) throw new Error('Failed to end auction');
      return await response.json();
    } catch (error) {
      console.error('Error ending auction:', error);
      throw error;
    }
  },

  /**
   * Place a bid
   */
  async placeBid(bid: Bid): Promise<any> {
    try {
      const response = await fetch(API_ENDPOINTS.PLACE_BID, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({
          player_id: bid.playerId,
          team_id: bid.teamId,
          bid_amount: bid.bidAmount,
        }),
      });
      if (!response.ok) throw new Error('Failed to place bid');
      return await response.json();
    } catch (error) {
      console.error('Error placing bid:', error);
      throw error;
    }
  },

  /**
   * Mark player as sold
   */
  async markSold(playerId: number, teamId: number, soldPrice: number): Promise<any> {
    try {
      const response = await fetch(API_ENDPOINTS.MARK_SOLD, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({
          player_id: playerId,
          team_id: teamId,
          sold_price: soldPrice,
        }),
      });
      if (!response.ok) throw new Error('Failed to mark player as sold');
      return await response.json();
    } catch (error) {
      console.error('Error marking player as sold:', error);
      throw error;
    }
  },

  /**
   * Mark player as unsold
   */
  async markUnsold(playerId: number): Promise<any> {
    try {
      const response = await fetch(API_ENDPOINTS.MARK_UNSOLD, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({ player_id: playerId }),
      });
      if (!response.ok) throw new Error('Failed to mark player as unsold');
      return await response.json();
    } catch (error) {
      console.error('Error marking player as unsold:', error);
      throw error;
    }
  },
};

export default auctionAPI;
