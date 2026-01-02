

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface WeatherCondition {
    id: number;
    main: string;
    description: string;
    icon: string;
}

export interface CurrentWeatherResponse {
    coord: {
        lon: number;
        lat: number;
    };
    weather: WeatherCondition[];
    base: string;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
        sea_level?: number;
        grnd_level?: number;
    };
    visibility: number;
    wind: {
        speed: number;
        deg: number;
        gust?: number;
    };
    clouds: {
        all: number;
    };
    rain?: {
        '1h'?: number;
        '3h'?: number;
    };
    snow?: {
        '1h'?: number;
        '3h'?: number;
    };
    dt: number;
    sys: {
        type?: number;
        id?: number;
        country: string;
        sunrise: number;
        sunset: number;
    };
    timezone: number;
    id: number;
    name: string;
    cod: number;
}

export interface DailyForecastItem {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: {
        day: number;
        min: number;
        max: number;
        night: number;
        eve: number;
        morn: number;
    };
    feels_like: {
        day: number;
        night: number;
        eve: number;
        morn: number;
    };
    pressure: number;
    humidity: number;
    weather: WeatherCondition[];
    speed: number;
    deg: number;
    gust?: number;
    clouds: number;
    pop: number;
    rain?: number;
    snow?: number;
}

export interface DailyForecastResponse {
    city: {
        id: number;
        name: string;
        coord: {
            lon: number;
            lat: number;
        };
        country: string;
        population: number;
        timezone: number;
    };
    cod: string;
    message: number;
    cnt: number;
    list: DailyForecastItem[];
}

export interface HourlyForecastItem {
    dt: number;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        sea_level: number;
        grnd_level: number;
        humidity: number;
        temp_kf: number;
    };
    weather: WeatherCondition[];
    clouds: {
        all: number;
    };
    wind: {
        speed: number;
        deg: number;
        gust?: number;
    };
    visibility: number;
    pop: number;
    rain?: {
        '3h'?: number;
    };
    snow?: {
        '3h'?: number;
    };
    sys: {
        pod: string;
    };
    dt_txt: string;
}

export interface HourlyForecastResponse {
    cod: string;
    message: number;
    cnt: number;
    list: HourlyForecastItem[];
    city: {
        id: number;
        name: string;
        coord: {
            lat: number;
            lon: number;
        };
        country: string;
        population: number;
        timezone: number;
        sunrise: number;
        sunset: number;
    };
}

export interface AirPollutionData {
    main: {
        aqi: number;
    };
    components: {
        co: number;
        no: number;
        no2: number;
        o3: number;
        so2: number;
        pm2_5: number;
        pm10: number;
        nh3: number;
    };
    dt: number;
}

export interface AirPollutionResponse {
    coord: {
        lon: number;
        lat: number;
    };
    list: AirPollutionData[];
}

export interface UVIndexResponse {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    daily_units: {
        time: string;
        uv_index_max: string;
        uv_index_clear_sky_max: string;
    };
    daily: {
        time: string[];
        uv_index_max: number[];
        uv_index_clear_sky_max: number[];
    };
}

export interface Location {
    city: string;
    country: string;
    coordinates: Coordinates;
}

export interface FavoriteCity {
    id: string;
    name: string;
    country: string;
    coordinates: Coordinates;
    addedAt: number;
}

export interface RecentSearch {
    id: string;
    query: string;
    location: Location;
    timestamp: number;
}

export interface AppSettings {
    theme: 'light' | 'dark' | 'system';
    language: 'en' | 'uk';
    units: 'metric' | 'imperial';
    notifications: boolean;
}

export interface ApiError {
    status: number;
    message: string;
    code?: string;
}

export type WeatherErrorType =
    | 'NETWORK_ERROR'
    | 'NOT_FOUND'
    | 'RATE_LIMIT'
    | 'UNAUTHORIZED'
    | 'SERVER_ERROR'
    | 'UNKNOWN';

export interface WeatherError {
    type: WeatherErrorType;
    message: string;
    retryable: boolean;
}
