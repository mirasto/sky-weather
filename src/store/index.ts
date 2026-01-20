import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { weatherApi } from '@/services/api/weatherApi';
import locationSlice from './slices/locationSlice';
import settingsSlice from './slices/settingsSlice';
import favoritesSlice from './slices/favoritesSlice';
import weatherInteractionSlice from './slices/weatherInteractionSlice';

export const store = configureStore({
    reducer: {
        location: locationSlice,
        settings: settingsSlice,
        favorites: favoritesSlice,
        weatherInteraction: weatherInteractionSlice,
        [weatherApi.reducerPath]: weatherApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
            }
        }).concat(weatherApi.middleware),
    devTools: import.meta.env.DEV
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
