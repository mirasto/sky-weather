import { motion } from 'framer-motion';
import { MapPin, Droplets, Wind, Heart, HeartOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCoordinates, selectLocation } from '@/store/slices/locationSlice';
import { addFavorite, removeFavorite, selectIsFavorite } from '@/store/slices/favoritesSlice';
import { useGetCurrentWeatherQuery } from '@/services/api/weatherApi';
import { WeatherCardSkeleton } from '@/components/ui';
import {
    formatTemperature,
    formatWindSpeed,
    getWeatherIconUrl,
    cn
} from '@/utils/helpers';
import { STORAGE_KEYS, WEATHER_BACKGROUNDS } from '@/utils/constants';

export function CurrentConditions() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const coordinates = useAppSelector(selectCoordinates);
    const location = useAppSelector(selectLocation);
    const isFavorite = useAppSelector((state: any) => selectIsFavorite(coordinates.lat, coordinates.lng)(state));

    const { data, isLoading, isError, refetch } = useGetCurrentWeatherQuery(coordinates);

    const handleToggleFavorite = () => {
        if (isFavorite) {
            
            const favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
            const favoriteCity = favorites.find(
                (f: any) =>
                    f.coordinates.lat === coordinates.lat && f.coordinates.lng === coordinates.lng
            );
            if (favoriteCity) {
                dispatch(removeFavorite(favoriteCity.id));
            }
        } else {
            dispatch(addFavorite({
                name: location.city,
                country: location.country,
                coordinates
            }));
        }
    };

    if (isLoading) {
        return <WeatherCardSkeleton />;
    }

    if (isError || !data) {
        return (
            <div className="glass-card p-6 text-center">
                <p className="text-red-500 mb-4">{t('errors.apiError')}</p>
                <button onClick={() => refetch()} className="btn-primary">
                    {t('common.retry')}
                </button>
            </div>
        );
    }

    const weatherMain = data.weather[0]?.main || 'default';
    const backgroundGradient = WEATHER_BACKGROUNDS[weatherMain as keyof typeof WEATHER_BACKGROUNDS] || WEATHER_BACKGROUNDS.default;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl"
        >
            
            <div className={cn(
                'absolute inset-0 bg-gradient-to-br',
                backgroundGradient,
                'opacity-90'
            )} />

            <div className="absolute inset-0 backdrop-blur-sm bg-black/10" />

            <div className="relative p-6 text-white h-full flex flex-col justify-between">
                
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-white/80" />
                        <div>
                            <h2 className="text-xl font-bold">{data.name}</h2>
                            <p className="text-sm text-white/70">{data.sys.country}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleToggleFavorite}
                        className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 transition-all active:scale-95"
                        aria-label={isFavorite ? t('favorites.remove') : t('favorites.add')}
                    >
                        {isFavorite ? (
                            <Heart className="w-5 h-5 fill-red-400 text-red-400" />
                        ) : (
                            <HeartOff className="w-5 h-5" />
                        )}
                    </button>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="text-7xl font-light tracking-tight"
                        >
                            {formatTemperature(data.main.temp, 'metric', false)}°
                        </motion.div>
                        <p className="text-xl text-white/90 font-medium capitalize mt-1">
                            {data.weather[0]?.description}
                        </p>
                    </div>
                    <motion.img
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        src={getWeatherIconUrl(data.weather[0]?.icon || '01d', '4x')}
                        alt={data.weather[0]?.description || 'Weather'}
                        className="w-32 h-32 drop-shadow-2xl"
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm font-medium">
                        <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                            H: {Math.round(data.main.temp_max)}° L: {Math.round(data.main.temp_min)}°
                        </span>
                        <span className="text-white/80">
                            {t('weather.feelsLike')} {formatTemperature(data.main.feels_like)}
                        </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-2">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                            <div className="flex items-center gap-2 text-white/60 mb-1">
                                <Droplets className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">{t('weather.humidity')}</span>
                            </div>
                            <p className="text-base font-bold">{data.main.humidity}%</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                            <div className="flex items-center gap-2 text-white/60 mb-1">
                                <Wind className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">{t('weather.wind')}</span>
                            </div>
                            <p className="text-base font-bold">{formatWindSpeed(data.wind.speed)}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                            <div className="flex items-center gap-2 text-white/60 mb-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider">{t('weather.pressure')}</span>
                            </div>
                            <p className="text-base font-bold">{data.main.pressure} hPa</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default CurrentConditions;
