import { useState, useEffect, useCallback } from 'react';
import { fetchMeteoActuelle, fetchPrevisions, MeteoData, Prevision, searchCities } from '../services/weather';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CITY_KEY = 'agria_city';

async function loadCity(): Promise<string> {
  try {
    const saved = await AsyncStorage.getItem(CITY_KEY);
    if (saved) return saved;
  } catch {}
  return 'Paris';
}

async function saveCity(city: string): Promise<void> {
  try { await AsyncStorage.setItem(CITY_KEY, city); } catch {}
}

export function useWeather(initialCity: string) {
  const [city, setCityState] = useState(initialCity);
  const [meteo, setMeteo] = useState<MeteoData | null>(null);
  const [previsions, setPrevisions] = useState<Prevision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCity().then(saved => {
      setCityState(saved);
    });
  }, []);

  const setCity = useCallback((c: string) => {
    setCityState(c);
    saveCity(c);
  }, []);

  const refresh = useCallback(async (c?: string) => { const t = c || city; setLoading(true); const [m, p] = await Promise.all([fetchMeteoActuelle(t), fetchPrevisions(t)]); setMeteo(m); setPrevisions(p); setLoading(false); }, [city]);
  useEffect(() => { setLoading(true); Promise.all([fetchMeteoActuelle(city), fetchPrevisions(city)]).then(([m, p]) => { setMeteo(m); setPrevisions(p); }).finally(() => setLoading(false)); }, [city]);
  return { meteo, previsions, loading, city, setCity, refresh };
}

export function useCitySearch() {
  const [results, setResults] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  useEffect(() => { if (query.length < 2) { setResults([]); return; } const t = setTimeout(async () => { const r = await searchCities(query); setResults(r); }, 350); return () => clearTimeout(t); }, [query]);
  return { results, query, setQuery };
}
