import { useEffect } from 'react';
import { useAuctionStore, Player } from '../store/useAuctionStore';
import { socketUrl, fetchFromBackend } from '../utils/api';

export const useAuctionSync = () => {
  const store = useAuctionStore();

  useEffect(() => {
    // 1. Fetch Initial Data
    store.fetchInitialData();

    // 2. Setup WebSocket
    const ws = new WebSocket(socketUrl);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      console.log('WS Message:', msg);

      switch (msg.type) {
        case 'BID_UPDATE':
          // Convert from backend (₹) to frontend (Lakhs)
          const amountLakhs = msg.data.amount / 100000;
          store.updateBidDisplay(amountLakhs, msg.data.team_id);
          break;

        case 'PLAYER_SOLD':
          store.markSold(msg.data.player_id, msg.data.team_id, msg.data.sold_price / 100000);
          break;

        case 'AUCTION_RESET':
          store.fetchInitialData(); // Full reload
          break;

        case 'PLAYER_SELECTED':
          store.fetchInitialData(); // Sync current player and state
          break;

        case 'LEADERBOARD_UPDATE':
          store.setTeams(msg.data.map((t: any) => ({
            id: t.id,
            name: t.name,
            shortName: t.code,
            purse: t.purse_balance / 100000,
            logo: t.logo_url,
            players: [],
            color: t.color || '#000',
            primaryColor: t.primary_color || '#000',
            secondaryColor: t.secondary_color || '#fff',
            rank: t.rank,
            totalPoints: t.total_points
          })));
          break;

        case 'AUCTION_COMPLETED':
          store.updateState({ auctionStarted: true, auctionPaused: false });
          store.fetchInitialData();
          break;

        case 'STATE_SYNC':
          store.fetchInitialData();
          break;
      }
    };

    return () => ws.close();
  }, []);

  // Override store actions to call Backend API
  const backendActions = {
    ...store,

    startAuction: async () => {
      // Find an unsold player to start with
      const nextPlayer = store.players.find(p => !p.sold);
      if (nextPlayer) {
        await fetchFromBackend(`/auction/select-player/${nextPlayer.id}`, {
          method: 'POST'
        });
        // Status update would come via WS or manual next call
      }
    },

    placeBid: async (teamId: string, amount: number) => {
      try {
        await fetchFromBackend('/auction/bid', {
          method: 'POST',
          body: JSON.stringify({
            team_id: teamId,
            amount: amount * 100000 // To ₹
          })
        });
      } catch (e) {
        console.error('Bid failed:', e);
      }
    },

    setCurrentPlayer: async (player: Player | null) => {
      if (player) {
        try {
          await fetchFromBackend(`/auction/select-player/${player.id}`, {
            method: 'POST'
          });
        } catch (e) {
          console.error('Player selection failed:', e);
        }
      } else {
        store.setCurrentPlayer(null);
      }
    },

    updateBidDisplay: async (amount: number, _teamId: string = '') => {
      try {
        await fetchFromBackend('/auction/bid', {
          method: 'POST',
          body: JSON.stringify({
            amount: amount * 100000 // To ₹
            // team_id is omitted for price-only updates
          })
        });
      } catch (e) {
        console.error('Bid display sync failed:', e);
      }
    },

    placeBidFromViewer: async (bidAmount: number, teamId: string) => {
      try {
        await fetchFromBackend('/auction/bid', {
          method: 'POST',
          body: JSON.stringify({
            team_id: teamId,
            amount: bidAmount * 100000
          })
        });
        return { success: true, message: 'Bid placed successfully' };
      } catch (e: any) {
        return { success: false, message: e.message || 'Bid failed' };
      }
    },

    markSold: async (_playerId: string, _teamId: string, _price: number) => {
      try {
        await fetchFromBackend('/auction/confirm-sale', { method: 'POST' });
      } catch (e) {
        console.error('Sale confirmation failed:', e);
      }
    },

    resetAuction: async () => {
      try {
        await fetchFromBackend('/auction/reset', { method: 'POST' });
        await store.fetchInitialData();
      } catch (e) {
        console.error('Reset failed:', e);
      }
    }

  };

  return backendActions;
};