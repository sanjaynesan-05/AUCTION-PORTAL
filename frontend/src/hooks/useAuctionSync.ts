import { useEffect } from 'react';
import { useAuctionStore } from '../store/useAuctionStore';
import { auctionSync } from '../utils/auctionSync';

export const useAuctionSync = () => {
  const store = useAuctionStore();

  useEffect(() => {
    // Subscribe to store changes directly
    const unsubscribeStore = useAuctionStore.subscribe(
      (state) => {
        // Broadcast any store change to localStorage/custom event
        auctionSync.broadcast(state);
      }
    );

    // Subscribe to external state changes (from other tabs or events)
    const unsubscribeSync = auctionSync.subscribe((externalState) => {
      // Only update if the external state is newer
      // Avoid overwriting if only lastUpdate changed (to prevent flickering)
      if (externalState.lastUpdate && externalState.lastUpdate > store.lastUpdate) {
        // Check if this is a significant state change or just a broadcast of our own state
        // If currentBid, currentBidder, or bidHistory changed, apply the update
        const currentState = useAuctionStore.getState();
        const isSamePlayer = currentState.currentPlayer?.id === externalState.currentPlayer?.id;
        const hasBidChanges = 
          currentState.currentBid !== externalState.currentBid ||
          currentState.currentBidder !== externalState.currentBidder ||
          (currentState.bidHistory?.length || 0) !== (externalState.bidHistory?.length || 0);
        
        // Only update if it's a different player or there are bid changes
        if (!isSamePlayer || hasBidChanges || externalState.auctionStarted !== currentState.auctionStarted) {
          useAuctionStore.setState(externalState);
        }
      }
    });

    // Load initial state from storage
    const storedState = auctionSync.getStoredState();
    if (storedState && storedState.lastUpdate > store.lastUpdate) {
      useAuctionStore.setState(storedState);
    }

    return () => {
      unsubscribeStore();
      unsubscribeSync();
    };
  }, []);

  // Override store actions to broadcast changes
  const enhancedStore = {
    ...store,
    startAuction: async () => {
      await store.startAuction();
      const newState = useAuctionStore.getState();
      auctionSync.broadcast({ ...newState, lastUpdate: Date.now() });
    },
    pauseAuction: async () => {
      await store.pauseAuction();
      const newState = useAuctionStore.getState();
      auctionSync.broadcast({ ...newState, lastUpdate: Date.now() });
    },
    resumeAuction: async () => {
      await store.resumeAuction();
      const newState = useAuctionStore.getState();
      auctionSync.broadcast({ ...newState, lastUpdate: Date.now() });
    },
    nextPlayer: async () => {
      await store.nextPlayer();
      const newState = useAuctionStore.getState();
      auctionSync.broadcast({ ...newState, lastUpdate: Date.now() });
    },
    previousPlayer: async () => {
      await store.previousPlayer();
      const newState = useAuctionStore.getState();
      auctionSync.broadcast({ ...newState, lastUpdate: Date.now() });
    },
    placeBid: async (teamId: number, amount: number) => {
      await store.placeBid(teamId, amount);
      const newState = useAuctionStore.getState();
      auctionSync.broadcast({ ...newState, lastUpdate: Date.now() });
    },
    markSold: async (playerId: number, teamId: number, price: number) => {
      await store.markSold(playerId, teamId, price);
      const newState = useAuctionStore.getState();
      auctionSync.broadcast({ ...newState, lastUpdate: Date.now() });
    },
    markUnsold: async (playerId: number) => {
      await store.markUnsold(playerId);
      const newState = useAuctionStore.getState();
      auctionSync.broadcast({ ...newState, lastUpdate: Date.now() });
    },
    placeBidFromViewer: async (bidAmount: number, teamId: number) => {
      const result = await store.placeBidFromViewer(bidAmount, teamId);
      if (result.success) {
        const newState = useAuctionStore.getState();
        auctionSync.broadcast({ ...newState, lastUpdate: Date.now() });
      }
      return result;
    },
  };

  return enhancedStore;
};