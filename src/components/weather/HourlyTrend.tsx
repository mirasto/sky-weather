import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCoordinates } from '@/store/slices/locationSlice';
import { setSelectedWeather } from '@/store/slices/weatherInteractionSlice';
import { useGetHourlyForecastQuery } from '@/services/api/weatherApi';
import { Card, CardHeader, HourlyForecastSkeleton } from '@/components/ui';
import { formatTemperature, formatTime, getWeatherIconUrl, cn } from '@/utils/helpers';
import { LIMITS } from '@/utils/constants';
import { CurrentWeatherResponse } from '@/types';

export function HourlyTrend() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const coordinates = useAppSelector(selectCoordinates);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, isError } = useGetHourlyForecastQuery(coordinates);
    const selectedWeather = useAppSelector((state: any) => state.weatherInteraction.selectedWeather);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -200 : 200;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleHourClick = (hour: any) => {
        if (!data) return;

        const weatherData: CurrentWeatherResponse = {
            coord: {
                lat: data.city.coord.lat,
                lon: data.city.coord.lon
            },
            weather: hour.weather,
            base: 'stations',
            main: hour.main,
            visibility: hour.visibility,
            wind: hour.wind,
            clouds: hour.clouds,
            dt: hour.dt,
            sys: {
                country: data.city.country,
                sunrise: data.city.sunrise,
                sunset: data.city.sunset
            },
            timezone: data.city.timezone,
            id: data.city.id,
            name: data.city.name,
            cod: 200
        };

        dispatch(setSelectedWeather(weatherData));
    };

    if (isLoading) {
        return <HourlyForecastSkeleton />;
    }

    if (isError || !data) {
        return null;
    }

    const hourlyData = data.list.slice(0, LIMITS.HOURLY_FORECAST_DISPLAY);
    const timezone = data.city.timezone;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <Card className="overflow-hidden">
                <CardHeader
                    title={t('forecast.hourly')}
                    icon={<Clock className="w-4 h-4" />}
                    action={
                        <div className="flex gap-1">
                            <button
                                onClick={() => scroll('left')}
                                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                aria-label="Scroll left"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                aria-label="Scroll right"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    }
                />

                <div
                    ref={scrollContainerRef}
                    className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4"
                >
                    {hourlyData.map((hour, index) => {
                        const isNow = index === 0 && !selectedWeather;
                        const isSelected = selectedWeather?.dt === hour.dt;
                        const active = isNow || isSelected;

                        return (
                            <motion.div
                                key={hour.dt}
                                onClick={() => handleHourClick(hour)}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className={cn(
                                    'flex-shrink-0 flex flex-col items-center gap-2 py-3 px-4 rounded-2xl cursor-pointer',
                                    'transition-all duration-200',
                                    active
                                        ? 'bg-indigo-100 dark:bg-indigo-900/50 scale-105'
                                        : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'
                                )}
                            >
                                <span className={cn(
                                    'text-xs font-medium',
                                    active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
                                )}>
                                    {index === 0 ? t('forecast.today') : formatTime(hour.dt, timezone, { hour: 'numeric' })}
                                </span>

                                <img
                                    src={getWeatherIconUrl(hour.weather[0]?.icon || '01d', '2x')}
                                    alt={hour.weather[0]?.description || 'Weather'}
                                    className="w-10 h-10"
                                />

                                <span className={cn(
                                    'text-sm font-semibold',
                                    active ? 'text-indigo-700 dark:text-indigo-300' : ''
                                )}>
                                    {formatTemperature(hour.main.temp, 'metric', false)}°
                                </span>

                                {hour.pop > 0 && (
                                    <span className="text-xs text-blue-500 flex items-center gap-0.5">
                                        💧 {Math.round(hour.pop * 100)}%
                                    </span>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </Card>
        </motion.div>
    );
}

export default HourlyTrend;
