import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Coordinates, Location } from '@/types';
import { DEFAULT_LOCATION, STORAGE_KEYS } from '@/utils/constants';
import { safeJsonParse } from '@/utils/helpers';

interface LocationState {
    current: Location;
    coordinates: Coordinates;
    isLoading: boolean;
    error: string | null;
    lastUpdated: number | null;
}

const savedLocation = safeJsonParse<Location | null>(
    localStorage.getItem(STORAGE_KEYS.LAST_LOCATION) || '',
    null
);

const initialState: LocationState = {
    current: savedLocation || DEFAULT_LOCATION,
    coordinates: savedLocation?.coordinates || DEFAULT_LOCATION.coordinates,
    isLoading: false,
    error: null,
    lastUpdated: null
};

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        setLocation: (state, action: PayloadAction<Location>) => {
            state.current = action.payload;
            state.coordinates = action.payload.coordinates;
            state.lastUpdated = Date.now();
            state.error = null;
            
            localStorage.setItem(STORAGE_KEYS.LAST_LOCATION, JSON.stringify(action.payload));
        },
        setCoordinates: (state, action: PayloadAction<Coordinates>) => {
            state.coordinates = action.payload;
            state.lastUpdated = Date.now();
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        clearLocation: (state) => {
            state.current = DEFAULT_LOCATION;
            state.coordinates = DEFAULT_LOCATION.coordinates;
            state.error = null;
            localStorage.removeItem(STORAGE_KEYS.LAST_LOCATION);
        }
    }
});

export const {
    setLocation,
    setCoordinates,
    setLoading,
    setError,
    clearLocation
} = locationSlice.actions;

export default locationSlice.reducer;

export const selectLocation = (state: { location: LocationState }) => state.location.current;
export const selectCoordinates = (state: { location: LocationState }) => state.location.coordinates;
export const selectLocationLoading = (state: { location: LocationState }) => state.location.isLoading;
export const selectLocationError = (state: { location: LocationState }) => state.location.error;
