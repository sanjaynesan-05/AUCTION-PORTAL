/**
 * Enhanced hook that integrates useAuctionAPI with synchronization
 */
import { useEffect, useState } from 'react';
import useAuctionAPI from '../store/useAuctionAPI';
import { auctionSync } from '../utils/auctionSync';

export const useAuctionIntegration = () => {
  const apiStore = useAuctionAPI();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    const init = async () => {
      try {
        await apiStore.initializeAuction();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize auction:', error);
      }
    };

    if (!isInitialized) {
      init();
    }
  }, [isInitialized, apiStore]);

  // Sync local changes to other tabs/windows
  useEffect(() => {
    if (!isInitialized) return;

    const unsubscribe = auctionSync.subscribe((externalState) => {
      // Update store from external changes (from other tabs)
      if (externalState.players) {
        // Re-sync data from API
        apiStore.loadPlayers();
      }
    });

    return unsubscribe;
  }, [isInitialized, apiStore]);

  // Broadcast state changes to other tabs
  const broadcastState = () => {
    const state = {
      players: apiStore.players,
      teams: apiStore.teams,
      currentPlayer: apiStore.currentPlayer,
      currentBid: apiStore.currentBid,
      auctionStarted: apiStore.auctionStarted,
      lastUpdate: Date.now(),
    };
    auctionSync.broadcast(state);
  };

  // Enhanced actions with broadcasting
  return {
    ...apiStore,
    isInitialized,
    
    startAuction: async () => {
      await apiStore.startAuction();
      broadcastState();
    },

    endAuction: async () => {
      await apiStore.endAuction();
      broadcastState();
    },

    nextPlayer: () => {
      apiStore.nextPlayer();
      broadcastState();
    },

    previousPlayer: () => {
      apiStore.previousPlayer();
      broadcastState();
    },

    markSold: async (playerId: number, teamId: number, price: number) => {
      await apiStore.markSold(playerId, teamId, price);
      broadcastState();
    },

    markUnsold: async (playerId: number) => {
      await apiStore.markUnsold(playerId);
      broadcastState();
    },

    placeBid: async (teamId: number, amount: number) => {
      await apiStore.placeBid(teamId, amount);
      broadcastState();
    },
  };
};
