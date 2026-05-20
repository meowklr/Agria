import { useState, useEffect, useCallback } from 'react';
import { fetchMeteoActuelle, fetchPrevisions, MeteoData, Prevision, searchCities } from '../services/weather';

export function useWeather(initialCity: string) {
  const [city, setCity] = useState(initialCity);
  const [meteo, setMeteo] = useState<MeteoData | null>(null);
  const [previsions, setPrevisions] = useState<Prevision[]>([]);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async (c?: string) => { const t = c || city; setLoading(true); const [m, p] = await Promise.all([fetchMeteoActuelle(t), fetchPrevisions(t)]); setMeteo(m); setPrevisions(p); setLoading(false); }, [city]);
  useEffect(() => { refresh(); }, []);
  return { meteo, previsions, loading, city, setCity, refresh };
}

export function useCitySearch() {
  const [results, setResults] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  useEffect(() => { if (query.length < 2) { setResults([]); return; } const t = setTimeout(async () => { const r = await searchCities(query); setResults(r); }, 350); return () => clearTimeout(t); }, [query]);
  return { results, query, setQuery };
}
