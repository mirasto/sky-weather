import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
    CurrentWeatherResponse,
    AirPollutionResponse,
    Coordinates,
    HourlyForecastResponse
} from '@/types';
import { CACHE_CONFIG } from '@/utils/constants';

const API_KEY = import.meta.env.VITE_API_KEY_OPENWEATHERMAP;
const OPENWEATHER_BASE = 'https://api.openweathermap.org';
const OPENWEATHER_MAP_URL = 'https://tile.openweathermap.org';

export const weatherApi = createApi({
    reducerPath: 'weatherApi',
    baseQuery: fetchBaseQuery({
        baseUrl: OPENWEATHER_BASE
    }),
    tagTypes: ['Weather', 'Forecast', 'AirQuality'],
    endpoints: (builder) => ({

        getCurrentWeather: builder.query<CurrentWeatherResponse, Coordinates>({
            query: ({ lat, lng }) => ({
                url: '/data/2.5/weather',
                params: {
                    lat,
                    lon: lng,
                    units: 'metric',
                    appid: API_KEY
                }
            }),
            providesTags: (_result, _error, { lat, lng }) => [
                { type: 'Weather', id: `${lat}-${lng}` }
            ],
            keepUnusedDataFor: CACHE_CONFIG.WEATHER_TTL / 1000
        }),

        getHourlyForecast: builder.query<HourlyForecastResponse, Coordinates>({
            query: ({ lat, lng }) => ({
                url: '/data/2.5/forecast',
                params: {
                    lat,
                    lon: lng,
                    units: 'metric',
                    appid: API_KEY
                }
            }),
            providesTags: (_result, _error, { lat, lng }) => [
                { type: 'Forecast', id: `hourly-${lat}-${lng}` }
            ],
            keepUnusedDataFor: CACHE_CONFIG.FORECAST_TTL / 1000
        }),

        getAirPollution: builder.query<AirPollutionResponse, Coordinates>({
            query: ({ lat, lng }) => ({
                url: '/data/2.5/air_pollution',
                params: {
                    lat,
                    lon: lng,
                    appid: API_KEY
                }
            }),
            providesTags: (_result, _error, { lat, lng }) => [
                { type: 'AirQuality', id: `${lat}-${lng}` }
            ],
            keepUnusedDataFor: CACHE_CONFIG.AIR_QUALITY_TTL / 1000
        })
    })
});

export const {
    useGetCurrentWeatherQuery,
    useGetHourlyForecastQuery,
    useGetAirPollutionQuery
} = weatherApi;

export interface OpenMeteoDailyResponse {
    latitude: number;
    longitude: number;
    timezone: string;
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        apparent_temperature_max: number[];
        precipitation_probability_max: number[];
        weathercode: number[];
        sunrise: string[];
        sunset: string[];
        windspeed_10m_max: number[];
        winddirection_10m_dominant: number[];
        uv_index_max: number[];
        relative_humidity_2m_mean: number[];
        surface_pressure_mean: number[];
    };
}

export const fetchDailyForecast = async (lat: number, lng: number): Promise<OpenMeteoDailyResponse> => {
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,precipitation_probability_max,weathercode,sunrise,sunset,windspeed_10m_max,winddirection_10m_dominant,uv_index_max,relative_humidity_2m_mean,surface_pressure_mean&timezone=auto&forecast_days=14`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch daily forecast');
    }

    return response.json();
};

export const fetchUVIndex = async (lat: number, lng: number) => {
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=uv_index_max,uv_index_clear_sky_max&timezone=auto`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch UV index');
    }

    return response.json();
};

export const getWeatherMapTileUrl = (layer: 'precipitation' | 'temperature' | 'clouds' = 'precipitation') => {
    const layerCodes = {
        precipitation: 'precipitation_new',
        temperature: 'temp_new',
        clouds: 'clouds_new'
    };

    return `${OPENWEATHER_MAP_URL}/map/${layerCodes[layer]}/{z}/{x}/{y}.png?appid=${API_KEY}`;
};

export const getWeatherIconFromCode = (code: number): string => {
    if (code === 0) return '01d';
    if (code <= 3) return '02d';
    if (code <= 48) return '50d';
    if (code <= 55) return '09d';
    if (code <= 65) return '10d';
    if (code <= 77) return '13d';
    if (code <= 82) return '09d';
    if (code <= 99) return '11d';
    return '01d';
};

export const getWeatherDescriptionFromCode = (code: number): string => {
    const descriptions: Record<number, string> = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with hail',
        99: 'Thunderstorm with heavy hail'
    };
    return descriptions[code] || 'Unknown';
};

export interface GeocodingResult {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    elevation: number;
    feature_code: string;
    country_code: string;
    admin1_id: number;
    admin2_id?: number;
    timezone: string;
    population?: number;
    country_id: number;
    country: string;
    admin1: string;
    admin2?: string;
}

export interface GeocodingResponse {
    results?: GeocodingResult[];
    generationtime_ms: number;
}

export const fetchGeocodingSuggestions = async (name: string, language: string = 'en'): Promise<GeocodingResponse> => {
    if (!name || name.length < 2) return { results: [], generationtime_ms: 0 };

    const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=10&language=${language}&format=json`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch geocoding suggestions');
    }

    return response.json();
};

