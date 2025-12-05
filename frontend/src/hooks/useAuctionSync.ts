import { useEffect, useRef } from 'react';
import { useAuctionStore } from '../store/useAuctionStore';
import { auctionSync } from '../utils/auctionSync';
import { dataService } from '../services/dataService';

export const useAuctionSync = () => {
  const store = useAuctionStore();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

    // Establish WebSocket connection for real-time updates (primary)
    const connectWebSocket = () => {
      try {
        const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
        wsRef.current = new WebSocket(`${wsUrl}/ws/auction`);

        wsRef.current.onopen = () => {
          console.log('✓ WebSocket connected for real-time auction updates');
          // Clear polling interval if WebSocket is connected
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
        };

        wsRef.current.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            
            if (message.type === 'auction_state_update' && message.data) {
              const data = message.data;
              const currentState = useAuctionStore.getState();
              
              // Check if significant state changes occurred
              const hasStateChanges = 
                data.auctionStarted !== currentState.auctionStarted ||
                data.auctionPaused !== currentState.auctionPaused ||
                data.currentIndex !== currentState.currentIndex ||
                data.currentBid !== currentState.currentBid ||
                data.currentBidder !== currentState.currentBidder;
              
              // Only update if there are actual state changes to avoid unnecessary re-renders
              if (hasStateChanges) {
                useAuctionStore.setState({
                  auctionStarted: data.auctionStarted || false,
                  auctionPaused: data.auctionPaused || false,
                  currentIndex: data.currentIndex || 0,
                  currentPlayer: data.currentPlayer || null,
                  currentBid: data.currentBid || 0,
                  currentBidder: data.currentBidder || null,
                  bidHistory: data.bidHistory || [],
                  lastUpdate: Date.now(),
                });
              }
            }
          } catch (error) {
            console.error('Error processing WebSocket message:', error);
          }
        };

        wsRef.current.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        wsRef.current.onclose = () => {
          console.log('WebSocket disconnected, attempting to reconnect in 3 seconds...');
          // Start fallback polling immediately
          startFallbackPolling();
          // Attempt to reconnect after 3 seconds
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
        };
      } catch (error) {
        console.error('Failed to establish WebSocket connection:', error);
        // Start fallback polling if WebSocket fails
        startFallbackPolling();
      }
    };

    // Fallback polling (500ms interval) if WebSocket unavailable
    const startFallbackPolling = () => {
      // Only start polling if not already polling
      if (pollIntervalRef.current) return;
      
      console.log('Starting fallback polling (500ms interval)');
      pollIntervalRef.current = setInterval(async () => {
        try {
          const auctionState = await dataService.getAuctionState();
          if (auctionState) {
            const currentState = useAuctionStore.getState();
            
            const hasStateChanges = 
              auctionState.auctionStarted !== currentState.auctionStarted ||
              auctionState.auctionPaused !== currentState.auctionPaused ||
              auctionState.currentIndex !== currentState.currentIndex ||
              auctionState.currentBid !== currentState.currentBid ||
              auctionState.currentBidder !== currentState.currentBidder;
            
            if (hasStateChanges) {
              const currentPlayerFromAPI = currentState.players[auctionState.currentIndex] || null;
              
              useAuctionStore.setState({
                auctionStarted: auctionState.auctionStarted,
                auctionPaused: auctionState.auctionPaused,
                currentIndex: auctionState.currentIndex,
                currentPlayer: currentPlayerFromAPI,
                currentBid: auctionState.currentBid,
                currentBidder: auctionState.currentBidder,
                lastUpdate: Date.now(),
              });
            }
          }
        } catch (error) {
          // Silently fail on polling errors
        }
      }, 500);
    };

    // Attempt initial WebSocket connection
    connectWebSocket();

    return () => {
      unsubscribeStore();
      unsubscribeSync();
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
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