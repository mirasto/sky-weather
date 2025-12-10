
export const API_CONFIG = {
    OPENWEATHER_BASE_URL: 'https://pro.openweathermap.org',
    OPENWEATHER_MAP_URL: 'https://maps.openweathermap.org',
    OPEN_METEO_BASE_URL: 'https://api.open-meteo.com',
    STADIA_TILES_URL: 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
} as const;

export const CACHE_CONFIG = {
    WEATHER_TTL: 5 * 60 * 1000, 
    FORECAST_TTL: 30 * 60 * 1000, 
    UV_TTL: 60 * 60 * 1000, 
    AIR_QUALITY_TTL: 30 * 60 * 1000 
} as const;

export const STORAGE_KEYS = {
    THEME: 'skyweather-theme',
    LANGUAGE: 'skyweather-language',
    UNITS: 'skyweather-units',
    FAVORITES: 'skyweather-favorites',
    RECENT_SEARCHES: 'skyweather-recent-searches',
    LAST_LOCATION: 'skyweather-last-location',
    SETTINGS: 'skyweather-settings'
} as const;

export const DEFAULT_COORDINATES = {
    lat: 50.4501,
    lng: 30.5234
} as const;

export const DEFAULT_LOCATION = {
    city: 'Kyiv',
    country: 'Ukraine',
    coordinates: DEFAULT_COORDINATES
} as const;

export const POPULAR_CITIES = [
    { city: 'New York', country: 'USA', lat: 40.7128, lng: -74.006 },
    { city: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
    { city: 'Tokyo', country: 'Japan', lat: 35.6895, lng: 139.6917 },
    { city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
    { city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
    { city: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 }
] as const;

export const WEATHER_BACKGROUNDS = {
    Clear: 'from-amber-400 to-orange-500',
    Clouds: 'from-gray-400 to-slate-600',
    Rain: 'from-blue-400 to-indigo-600',
    Drizzle: 'from-blue-300 to-blue-500',
    Thunderstorm: 'from-gray-700 to-purple-900',
    Snow: 'from-blue-100 to-gray-300',
    Mist: 'from-gray-300 to-gray-500',
    Fog: 'from-gray-400 to-gray-600',
    Haze: 'from-amber-200 to-amber-400',
    default: 'from-blue-500 to-indigo-600'
} as const;

export const AQI_LEVELS = [
    { max: 1, label: 'Good', color: '#4ade80', advice: 'Air quality is excellent. Enjoy outdoor activities.' },
    { max: 2, label: 'Fair', color: '#a3e635', advice: 'Air quality is acceptable for most people.' },
    { max: 3, label: 'Moderate', color: '#fbbf24', advice: 'Sensitive individuals should limit outdoor activities.' },
    { max: 4, label: 'Poor', color: '#f97316', advice: 'Everyone may begin to experience health effects.' },
    { max: 5, label: 'Very Poor', color: '#ef4444', advice: 'Health warning: everyone should reduce outdoor activity.' }
] as const;

export const UV_LEVELS = [
    { max: 2, label: 'Low', color: '#4ade80', advice: 'No protection needed.' },
    { max: 5, label: 'Moderate', color: '#fbbf24', advice: 'Wear sunscreen and hat.' },
    { max: 7, label: 'High', color: '#f97316', advice: 'Seek shade during midday hours.' },
    { max: 10, label: 'Very High', color: '#ef4444', advice: 'Avoid being outside during midday.' },
    { max: Infinity, label: 'Extreme', color: '#a855f7', advice: 'Take all precautions, stay indoors.' }
] as const;

export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
} as const;

export const ANIMATION = {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
} as const;

export const DELAYS = {
    SEARCH_DEBOUNCE: 300,
    SCROLL_THROTTLE: 100,
    RESIZE_DEBOUNCE: 250
} as const;

export const LIMITS = {
    MAX_FAVORITES: 10,
    MAX_RECENT_SEARCHES: 10,
    HOURLY_FORECAST_DISPLAY: 24,
    DAILY_FORECAST_DISPLAY: 10
} as const;
