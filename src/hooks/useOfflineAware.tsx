
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export function useOfflineAware() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: 'You are back online',
        description: 'Any pending trades will now be synchronized with the server.',
      });
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: 'You are offline',
        description: 'You can still add trades. They will sync when you reconnect.',
        variant: 'destructive',
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return { isOnline };
}
