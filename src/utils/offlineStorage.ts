
import { supabase } from "@/integrations/supabase/client";
import { Trade } from "@/types/trade";

// Open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('TradingJournalOfflineDB', 1);
    
    request.onerror = (event) => {
      reject('Error opening IndexedDB');
    };
    
    request.onsuccess = (event) => {
      resolve(request.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = request.result;
      
      // Create object stores
      if (!db.objectStoreNames.contains('offlineTrades')) {
        const tradesStore = db.createObjectStore('offlineTrades', { keyPath: 'id' });
        tradesStore.createIndex('date', 'date', { unique: false });
      }
    };
  });
}

// Store trade in IndexedDB for offline use
export async function storeTradeOffline(trade: Trade): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction(['offlineTrades'], 'readwrite');
    const store = transaction.objectStore('offlineTrades');
    
    // Add offline flag to trade
    const offlineTrade = {
      ...trade,
      offline: true,
      pendingSync: true
    };
    
    await store.add(offlineTrade);
    
    // Register for background sync if available
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-trades');
    }
    
  } catch (error) {
    console.error('Error storing trade offline:', error);
    throw error;
  }
}

// Get offline trades
export async function getOfflineTrades(): Promise<Trade[]> {
  try {
    const db = await openDB();
    const transaction = db.transaction(['offlineTrades'], 'readonly');
    const store = transaction.objectStore('offlineTrades');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        reject('Error fetching offline trades');
      };
    });
  } catch (error) {
    console.error('Error getting offline trades:', error);
    return [];
  }
}

// Sync offline trades when online
export async function syncOfflineTrades(): Promise<void> {
  if (!navigator.onLine) return;
  
  try {
    const offlineTrades = await getOfflineTrades();
    const pendingTrades = offlineTrades.filter(trade => trade.pendingSync);
    
    if (pendingTrades.length === 0) return;
    
    // Process each offline trade
    for (const trade of pendingTrades) {
      // Remove offline-specific properties
      const { offline, pendingSync, ...tradeToPush } = trade as any;
      
      // Push to Supabase
      const { error } = await supabase
        .from('trades')
        .insert({
          user_id: supabase.auth.getUser().then(({ data }) => data.user?.id),
          date: trade.date.toISOString(),
          ticker: trade.ticker,
          risk_r: trade.riskR,
          potential_r: trade.potentialR,
          r_value: trade.rValue,
          currency: trade.currency,
          outcome: trade.outcome,
          actual_r: trade.actualR,
          pnl: trade.pnl,
          entry_reason: trade.entryReason,
          exit_reason: trade.exitReason,
          screenshot: trade.screenshot,
          what_went_wrong: trade.reflection.whatWentWrong,
          what_went_right: trade.reflection.whatWentRight,
          followed_plan: trade.reflection.followedPlan,
          emotion_before: trade.reflection.emotions.before,
          emotion_during: trade.reflection.emotions.during,
          emotion_after: trade.reflection.emotions.after
        });
        
      if (!error) {
        // Remove from IndexedDB after successful sync
        const db = await openDB();
        const transaction = db.transaction(['offlineTrades'], 'readwrite');
        const store = transaction.objectStore('offlineTrades');
        await store.delete(trade.id);
      }
    }
  } catch (error) {
    console.error('Error syncing offline trades:', error);
  }
}

// Check if we're online and sync if needed
export function setupOnlineListener(): void {
  window.addEventListener('online', () => {
    syncOfflineTrades();
  });
}
