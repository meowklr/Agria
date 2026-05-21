export const CONFIG = {
  OPENWEATHER_API_KEY: "REMOVED_OPENWEATHER_KEY",
  OPENWEATHER_BASE_URL: "https://api.openweathermap.org/data/2.5",
  OPENMETEO_BASE_URL: "https://api.open-meteo.com/v1",
  NOMINATIM_SEARCH_URL: "https://nominatim.openstreetmap.org/search",
  MAKE_WEBHOOK_URL: "REMOVED_MAKE_WEBHOOK_URL",
};
export const METEO_FALLBACK = {
  ville: "Paris", temp: 17, humidity: 65, description: "Partiellement nuageux", icone: "cloud-sun",
  previsions: [
    { jour: "Lun", tempMax: 18, tempMin: 11, icone: "sun" },
    { jour: "Mar", tempMax: 15, tempMin: 9, icone: "cloud-rain" },
    { jour: "Mer", tempMax: 20, tempMin: 12, icone: "sun" },
    { jour: "Jeu", tempMax: 16, tempMin: 10, icone: "cloud" },
    { jour: "Ven", tempMax: 19, tempMin: 13, icone: "cloud-sun" },
  ],
};
export const OPENMETEO_FALLBACK = {
  precipitations7j: [2.1, 0, 5.4, 0, 0, 1.2, 8.0],
  tempMax: [14, 16, 13, 17, 18, 15, 12],
  tempMin: [7, 8, 6, 9, 10, 7, 5],
};
