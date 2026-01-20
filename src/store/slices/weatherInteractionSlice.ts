import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CurrentWeatherResponse } from '@/types';

interface WeatherInteractionState {
    selectedWeather: CurrentWeatherResponse | null;
}

const initialState: WeatherInteractionState = {
    selectedWeather: null,
};

export const weatherInteractionSlice = createSlice({
    name: 'weatherInteraction',
    initialState,
    reducers: {
        setSelectedWeather: (state, action: PayloadAction<CurrentWeatherResponse | null>) => {
            state.selectedWeather = action.payload;
        },
    },
});

export const { setSelectedWeather } = weatherInteractionSlice.actions;

export default weatherInteractionSlice.reducer;
