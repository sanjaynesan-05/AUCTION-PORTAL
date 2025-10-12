import { useEffect } from 'react';
import { useAuctionStore } from '../store/useAuctionStore';
import { auctionSync } from '../utils/auctionSync';

export const useAuctionSync = () => {
  const store = useAuctionStore();

  useEffect(() => {
    // Subscribe to external state changes
    const unsubscribe = auctionSync.subscribe((externalState) => {
      // Only update if the external state is newer
      if (externalState.lastUpdate && externalState.lastUpdate > store.lastUpdate) {
        useAuctionStore.setState(externalState);
      }
    });

    // Load initial state from storage
    const storedState = auctionSync.getStoredState();
    if (storedState && storedState.lastUpdate > store.lastUpdate) {
      useAuctionStore.setState(storedState);
    }

    return unsubscribe;
  }, [store.lastUpdate]);

  // Override store actions to broadcast changes
  const enhancedStore = {
    ...store,
    startAuction: () => {
      store.startAuction();
      const newState = useAuctionStore.getState();
      auctionSync.broadcast({ ...newState, lastUpdate: Date.now() });
    },
    pauseAuction: () => {
      store.pauseAuction();
      const newState = useAuctionStore.getState();
      auctionSync.broadcast({ ...newState, lastUpdate: Date.now() });
    },
    resumeAuction: () => {
      store.resumeAuction();
      const newState = useAuctionStore.getState();
      auctionSync.broadcast({ ...newState, lastUpdate: Date.now() });
    },
    nextPlayer: () => {
      store.nextPlayer();
      const newState = useAuctionStore.getState();
      auctionSync.broadcast({ ...newState, lastUpdate: Date.now() });
    },
    previousPlayer: () => {
      store.previousPlayer();
      const newState = useAuctionStore.getState();
      auctionSync.broadcast({ ...newState, lastUpdate: Date.now() });
    },
    placeBid: (teamId: number, amount: number) => {
      store.placeBid(teamId, amount);
      const newState = useAuctionStore.getState();
      auctionSync.broadcast({ ...newState, lastUpdate: Date.now() });
    },
    markSold: (playerId: number, teamId: number, price: number) => {
      store.markSold(playerId, teamId, price);
      const newState = useAuctionStore.getState();
      auctionSync.broadcast({ ...newState, lastUpdate: Date.now() });
    },
    markUnsold: (playerId: number) => {
      store.markUnsold(playerId);
      const newState = useAuctionStore.getState();
      auctionSync.broadcast({ ...newState, lastUpdate: Date.now() });
    },
  };

  return enhancedStore;
};