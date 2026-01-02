import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Theme, Language, TemperatureUnit } from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';
import { safeJsonParse } from '@/utils/helpers';

interface SettingsState {
    theme: Theme;
    language: Language;
    units: TemperatureUnit;
    notifications: boolean;
}

const savedSettings = safeJsonParse<Partial<SettingsState>>(
    localStorage.getItem(STORAGE_KEYS.SETTINGS) || '',
    {}
);

const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
};

const initialState: SettingsState = {
    theme: savedSettings.theme || 'system',
    language: savedSettings.language || 'en',
    units: savedSettings.units || 'metric',
    notifications: savedSettings.notifications ?? true
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload;
            saveSettings(state);
            applyTheme(action.payload);
        },
        setLanguage: (state, action: PayloadAction<Language>) => {
            state.language = action.payload;
            saveSettings(state);
        },
        setUnits: (state, action: PayloadAction<TemperatureUnit>) => {
            state.units = action.payload;
            saveSettings(state);
        },
        setNotifications: (state, action: PayloadAction<boolean>) => {
            state.notifications = action.payload;
            saveSettings(state);
        },
        resetSettings: (state) => {
            state.theme = 'system';
            state.language = 'en';
            state.units = 'metric';
            state.notifications = true;
            localStorage.removeItem(STORAGE_KEYS.SETTINGS);
            applyTheme('system');
        }
    }
});

function saveSettings(settings: SettingsState): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

function applyTheme(theme: Theme): void {
    const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;

    if (effectiveTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    localStorage.setItem(STORAGE_KEYS.THEME, effectiveTheme);
}

export const {
    setTheme,
    setLanguage,
    setUnits,
    setNotifications,
    resetSettings
} = settingsSlice.actions;

export default settingsSlice.reducer;

export const selectTheme = (state: any) => state.settings.theme;
export const selectLanguage = (state: any) => state.settings.language;
export const selectUnits = (state: any) => state.settings.units;
export const selectNotifications = (state: any) => state.settings.notifications;
