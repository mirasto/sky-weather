import { motion } from 'framer-motion';
import { MapPin, Droplets, Wind } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { selectCoordinates } from '@/store/slices/locationSlice';
import { useGetCurrentWeatherQuery } from '@/services/api/weatherApi';
import { WeatherCardSkeleton } from '@/components/ui';
import {
    formatTemperature,
    formatWindSpeed,
    getWeatherIconUrl,
    cn
} from '@/utils/helpers';
import { WEATHER_BACKGROUNDS } from '@/utils/constants';

export function CurrentConditions() {
    const { t } = useTranslation();
    const coordinates = useAppSelector(selectCoordinates);
    const { data: apiData, isLoading, isError, refetch } = useGetCurrentWeatherQuery(coordinates);
    const selectedWeather = useAppSelector((state: any) => state.weatherInteraction.selectedWeather);

    const data = selectedWeather || apiData;

    if (isLoading && !data) {
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

            <div className="relative p-6 md:p-8 text-white h-full flex flex-col justify-between">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
                    
                    <div className="flex flex-col justify-between h-full space-y-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-white/80" />
                                <div>
                                    <h2 className="text-xl font-bold">{data.name}</h2>
                                    <p className="text-sm text-white/70">{data.sys.country}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div>
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2, type: 'spring' }}
                                    className="text-7xl md:text-8xl font-light tracking-tight"
                                >
                                    {formatTemperature(data.main.temp, 'metric', false)}°
                                </motion.div>
                                <p className="text-xl md:text-2xl text-white/90 font-medium capitalize mt-2">
                                    {data.weather[0]?.description}
                                </p>
                            </div>
                            <motion.img
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.3, type: 'spring' }}
                                src={getWeatherIconUrl(data.weather[0]?.icon || '01d', '4x')}
                                alt={data.weather[0]?.description || 'Weather'}
                                className="w-32 h-32 md:w-40 md:h-40 drop-shadow-2xl"
                            />
                        </div>
                    </div>

                   
                    <div className="flex flex-col justify-end h-full space-y-6">
                        <div className="flex items-center gap-4 text-sm font-medium self-start md:self-end">
                            <span className="bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md">
                                {t('weather.highLow', {
                                    high: Math.round(data.main.temp_max),
                                    low: Math.round(data.main.temp_min)
                                })}
                            </span>
                            <span className="text-white/80">
                                {t('weather.feelsLike')} {formatTemperature(data.main.feels_like)}
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/20 transition-colors">
                                <div className="flex items-center gap-2 text-white/60 mb-2">
                                    <Droplets className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">{t('weather.humidity')}</span>
                                </div>
                                <p className="text-lg font-bold">{data.main.humidity}%</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/20 transition-colors">
                                <div className="flex items-center gap-2 text-white/60 mb-2">
                                    <Wind className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">{t('weather.wind')}</span>
                                </div>
                                <p className="text-lg font-bold">{formatWindSpeed(data.wind.speed)}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/20 transition-colors">
                                <div className="flex items-center gap-2 text-white/60 mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider">{t('weather.pressure')}</span>
                                </div>
                                <p className="text-lg font-bold">{data.main.pressure} hPa</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default CurrentConditions;
