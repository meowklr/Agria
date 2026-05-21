import { useEffect } from 'react';
import { Champ } from '../services/champs';
import { triggerDailyRiskAlert } from '../services/dailyRisk';

export function useMorningRiskAlert(_champs: Champ[]) {
  useEffect(() => {
    triggerDailyRiskAlert().catch(error => {
      console.warn('Erreur alerte quotidienne Agria', error);
    });
  }, []);
}
