// Real-time sync utility for cross-tab communication
class AuctionSync {
  private static instance: AuctionSync;
  private readonly STORAGE_KEY = 'auction_state';
  private readonly UPDATE_EVENT = 'auction_state_update';
  private subscribers: Set<(state: any) => void> = new Set();

  private constructor() {
    // Listen for storage changes from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === this.STORAGE_KEY && e.newValue) {
        try {
          const state = JSON.parse(e.newValue);
          this.notifySubscribers(state);
        } catch (error) {
          console.error('Failed to parse auction state from storage:', error);
        }
      }
    });

    // Listen for same-tab updates
    window.addEventListener(this.UPDATE_EVENT, ((e: CustomEvent) => {
      this.notifySubscribers(e.detail);
    }) as EventListener);
  }

  static getInstance(): AuctionSync {
    if (!AuctionSync.instance) {
      AuctionSync.instance = new AuctionSync();
    }
    return AuctionSync.instance;
  }

  // Subscribe to state changes
  subscribe(callback: (state: any) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  // Broadcast state change to other tabs
  broadcast(state: any): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
      window.dispatchEvent(new CustomEvent(this.UPDATE_EVENT, { detail: state }));
    } catch (error) {
      console.error('Failed to broadcast auction state:', error);
    }
  }

  // Get current state from storage
  getStoredState(): any | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to get stored auction state:', error);
      return null;
    }
  }

  private notifySubscribers(state: any): void {
    this.subscribers.forEach(callback => {
      try {
        callback(state);
      } catch (error) {
        console.error('Error in auction sync subscriber:', error);
      }
    });
  }
}

export const auctionSync = AuctionSync.getInstance();