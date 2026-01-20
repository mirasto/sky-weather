import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import i18n from '@/i18n';

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
    const locale = i18n.language;
    if (timezone !== undefined) {
        const utc = date.getTime() + date.getTimezoneOffset() * 60000;
        const localDate = new Date(utc + timezone * 1000);
        return localDate.toLocaleTimeString(locale, options);
    }
    return date.toLocaleTimeString(locale, options);
}

export function formatDate(
    timestamp: number,
    options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' }
): string {
    return unixToDate(timestamp).toLocaleDateString(i18n.language, options);
}

export function getDayName(timestamp: number, short = true): string {
    const date = unixToDate(timestamp);
    return date.toLocaleDateString(i18n.language, { weekday: short ? 'short' : 'long' });
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

export function getUVLevel(index: number): { levelKey: string; color: string; adviceKey: string } {
    if (index <= 2) {
        return {
            levelKey: 'low',
            color: '#4ade80',
            adviceKey: 'low'
        };
    } else if (index <= 5) {
        return {
            levelKey: 'moderate',
            color: '#fbbf24',
            adviceKey: 'moderate'
        };
    } else if (index <= 7) {
        return {
            levelKey: 'high',
            color: '#f97316',
            adviceKey: 'high'
        };
    } else if (index <= 10) {
        return {
            levelKey: 'veryHigh',
            color: '#ef4444',
            adviceKey: 'veryHigh'
        };
    }
    return {
        levelKey: 'extreme',
        color: '#a855f7',
        adviceKey: 'extreme'
    };
}

export function getAQILevel(aqi: number): { levelKey: string; color: string; adviceKey: string } {
    switch (aqi) {
        case 1:
            return { levelKey: 'good', color: '#4ade80', adviceKey: 'good' };
        case 2:
            return { levelKey: 'fair', color: '#a3e635', adviceKey: 'fair' };
        case 3:
            return { levelKey: 'moderate', color: '#fbbf24', adviceKey: 'moderate' };
        case 4:
            return { levelKey: 'poor', color: '#f97316', adviceKey: 'poor' };
        case 5:
            return { levelKey: 'veryPoor', color: '#ef4444', adviceKey: 'veryPoor' };
        default:
            return { levelKey: 'unknown', color: '#9ca3af', adviceKey: 'unknown' };
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
