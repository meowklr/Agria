import { useState, useEffect, useCallback } from 'react';
import { loadAlerts, AlertItem } from '../services/alerts';

export function useAlerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const items = await loadAlerts();
      setAlerts(items);
    } catch (error) {
      console.warn('Impossible de charger les alertes', error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { alerts, loading, refresh };
}
