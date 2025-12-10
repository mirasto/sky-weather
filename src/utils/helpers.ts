import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

export function formatTemperature(
    temp: number,
    unit: 'metric' | 'imperial' = 'metric',
    showUnit = true
): string {
    const rounded = Math.round(temp);
    if (!showUnit) return `${rounded}`;
    return unit === 'metric' ? `${rounded}°C` : `${rounded}°F`;
}

export function formatWindSpeed(
    speed: number,
    unit: 'metric' | 'imperial' = 'metric'
): string {
    const rounded = Math.round(speed * 10) / 10;
    return unit === 'metric' ? `${rounded} m/s` : `${rounded} mph`;
}

export function formatVisibility(meters: number): string {
    if (meters >= 1000) {
        return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${meters} m`;
}

export function formatPressure(hPa: number): string {
    return `${Math.round(hPa)} hPa`;
}

export function formatHumidity(percent: number): string {
    return `${Math.round(percent)}%`;
}

export function unixToDate(timestamp: number): Date {
    return new Date(timestamp * 1000);
}

export function formatTime(
    timestamp: number,
    timezone?: number,
    options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' }
): string {
    const date = unixToDate(timestamp);
    if (timezone !== undefined) {
        const utc = date.getTime() + date.getTimezoneOffset() * 60000;
        const localDate = new Date(utc + timezone * 1000);
        return localDate.toLocaleTimeString('en-US', options);
    }
    return date.toLocaleTimeString('en-US', options);
}

export function formatDate(
    timestamp: number,
    options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' }
): string {
    return unixToDate(timestamp).toLocaleDateString('en-US', options);
}

export function getDayName(timestamp: number, short = true): string {
    const date = unixToDate(timestamp);
    return date.toLocaleDateString('en-US', { weekday: short ? 'short' : 'long' });
}

export function isToday(timestamp: number): boolean {
    const today = new Date();
    const date = unixToDate(timestamp);
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
}

export function getUVLevel(index: number): { level: string; color: string; description: string } {
    if (index <= 2) {
        return {
            level: 'Low',
            color: '#4ade80',
            description: 'No protection needed'
        };
    } else if (index <= 5) {
        return {
            level: 'Moderate',
            color: '#fbbf24',
            description: 'Wear sunscreen'
        };
    } else if (index <= 7) {
        return {
            level: 'High',
            color: '#f97316',
            description: 'Seek shade during midday'
        };
    } else if (index <= 10) {
        return {
            level: 'Very High',
            color: '#ef4444',
            description: 'Avoid sun exposure'
        };
    }
    return {
        level: 'Extreme',
        color: '#a855f7',
        description: 'Stay indoors'
    };
}

export function getAQILevel(aqi: number): { level: string; color: string; description: string } {
    switch (aqi) {
        case 1:
            return { level: 'Good', color: '#4ade80', description: 'Air quality is excellent' };
        case 2:
            return { level: 'Fair', color: '#a3e635', description: 'Acceptable air quality' };
        case 3:
            return { level: 'Moderate', color: '#fbbf24', description: 'Sensitive groups take care' };
        case 4:
            return { level: 'Poor', color: '#f97316', description: 'Everyone may experience effects' };
        case 5:
            return { level: 'Very Poor', color: '#ef4444', description: 'Health warnings issued' };
        default:
            return { level: 'Unknown', color: '#9ca3af', description: 'Data unavailable' };
    }
}

export function getWindDirection(degrees: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}

export function getWeatherIconUrl(iconCode: string, size: '2x' | '4x' = '2x'): string {
    return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
}

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, wait);
    };
}

export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle = false;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function scrollToTop(behavior: ScrollBehavior = 'smooth'): void {
    window.scrollTo({ top: 0, behavior });
}

export function supportsGeolocation(): boolean {
    return 'geolocation' in navigator;
}

export function isProduction(): boolean {
    return import.meta.env.PROD;
}

export function safeJsonParse<T>(json: string, fallback: T): T {
    try {
        return JSON.parse(json) as T;
    } catch {
        return fallback;
    }
}
