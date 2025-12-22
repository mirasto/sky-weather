import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FavoriteCity, RecentSearch } from '@/types';
import { STORAGE_KEYS, LIMITS } from '@/utils/constants';
import { safeJsonParse, generateId } from '@/utils/helpers';

interface FavoritesState {
    cities: FavoriteCity[];
    recentSearches: RecentSearch[];
}

const savedFavorites = safeJsonParse<FavoriteCity[]>(
    localStorage.getItem(STORAGE_KEYS.FAVORITES) || '',
    []
);

const savedRecent = safeJsonParse<RecentSearch[]>(
    localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES) || '',
    []
);

const initialState: FavoritesState = {
    cities: savedFavorites,
    recentSearches: savedRecent
};

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        addFavorite: (state, action: PayloadAction<Omit<FavoriteCity, 'id' | 'addedAt'>>) => {
            
            const exists = state.cities.some(
                city => city.coordinates.lat === action.payload.coordinates.lat &&
                    city.coordinates.lng === action.payload.coordinates.lng
            );

            if (!exists && state.cities.length < LIMITS.MAX_FAVORITES) {
                const newCity: FavoriteCity = {
                    ...action.payload,
                    id: generateId(),
                    addedAt: Date.now()
                };
                state.cities.push(newCity);
                localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(state.cities));
            }
        },
        removeFavorite: (state, action: PayloadAction<string>) => {
            state.cities = state.cities.filter(city => city.id !== action.payload);
            localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(state.cities));
        },
        clearFavorites: (state) => {
            state.cities = [];
            localStorage.removeItem(STORAGE_KEYS.FAVORITES);
        },
        addRecentSearch: (state, action: PayloadAction<Omit<RecentSearch, 'id' | 'timestamp'>>) => {
            
            state.recentSearches = state.recentSearches.filter(
                search => search.query.toLowerCase() !== action.payload.query.toLowerCase()
            );

            const newSearch: RecentSearch = {
                ...action.payload,
                id: generateId(),
                timestamp: Date.now()
            };

            state.recentSearches.unshift(newSearch);

            if (state.recentSearches.length > LIMITS.MAX_RECENT_SEARCHES) {
                state.recentSearches = state.recentSearches.slice(0, LIMITS.MAX_RECENT_SEARCHES);
            }

            localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(state.recentSearches));
        },
        removeRecentSearch: (state, action: PayloadAction<string>) => {
            state.recentSearches = state.recentSearches.filter(search => search.id !== action.payload);
            localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(state.recentSearches));
        },
        clearRecentSearches: (state) => {
            state.recentSearches = [];
            localStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
        }
    }
});

export const {
    addFavorite,
    removeFavorite,
    clearFavorites,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches
} = favoritesSlice.actions;

export default favoritesSlice.reducer;

export const selectFavorites = (state: { favorites: FavoritesState }) => state.favorites.cities;
export const selectRecentSearches = (state: { favorites: FavoritesState }) => state.favorites.recentSearches;

export const selectIsFavorite = (lat: number, lng: number) => (state: { favorites: FavoritesState }) =>
    state.favorites.cities.some(
        city => city.coordinates.lat === lat && city.coordinates.lng === lng
    );
