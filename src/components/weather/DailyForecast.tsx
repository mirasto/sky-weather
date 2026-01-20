import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { selectCoordinates } from '@/store/slices/locationSlice';
import {
    fetchDailyForecast,
    getWeatherIconFromCode,
    getWeatherDescriptionFromCode,
    type OpenMeteoDailyResponse
} from '@/services/api/weatherApi';
import { Card, CardHeader, WidgetSkeleton } from '@/components/ui';
import { formatTemperature, cn } from '@/utils/helpers';
import { LIMITS } from '@/utils/constants';

export function DailyForecast() {
    const { t, i18n } = useTranslation();
    const coordinates = useAppSelector(selectCoordinates);
    const [data, setData] = useState<OpenMeteoDailyResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetchDailyForecast(coordinates.lat, coordinates.lng);
                setData(response);
            } catch (err) {
                setError('Failed to load forecast');
                console.error('Error fetching daily forecast:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [coordinates.lat, coordinates.lng]);

    if (isLoading) {
        return (
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                    <WidgetSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (error || !data) {
        return (
            <Card className="p-6 text-center">
                <p className="text-slate-500">{error || 'No forecast data'}</p>
            </Card>
        );
    }

    const forecastDays = data.daily.time.slice(0, LIMITS.DAILY_FORECAST_DISPLAY);
    const temps = [...data.daily.temperature_2m_min, ...data.daily.temperature_2m_max];
    const globalMin = Math.min(...temps);
    const globalMax = Math.max(...temps);
    const tempRange = globalMax - globalMin;

    const isToday = (dateStr: string) => {
        const today = new Date().toISOString().split('T')[0];
        return dateStr === today;
    };

    const getDayName = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString(i18n.language, { weekday: 'short' });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card>
                <CardHeader
                    title={t('forecast.daily')}
                    icon={<Calendar className="w-4 h-4" />}
                />

                <div className="space-y-1">
                    {forecastDays.map((dateStr, index) => {
                        const minTemp = data.daily.temperature_2m_min[index];
                        const maxTemp = data.daily.temperature_2m_max[index];
                        const pop = data.daily.precipitation_probability_max[index];
                        const weatherCode = data.daily.weathercode[index];
                        const today = isToday(dateStr);

                        const minPosition = ((minTemp - globalMin) / tempRange) * 100;
                        const maxPosition = ((maxTemp - globalMin) / tempRange) * 100;
                        const barWidth = maxPosition - minPosition;

                        return (
                            <motion.div
                                key={dateStr}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={cn(
                                    'flex items-center gap-2 sm:gap-3 py-3 px-3 rounded-xl',
                                    'transition-all duration-200',
                                    'hover:bg-slate-100 dark:hover:bg-slate-700/50',
                                    'cursor-pointer group',
                                    today && 'bg-indigo-50 dark:bg-indigo-900/20'
                                )}
                            >
                                
                                <div className="w-14 sm:w-16 flex-shrink-0">
                                    <span className={cn(
                                        'text-sm font-medium',
                                        today ? 'text-indigo-600 dark:text-indigo-400' : ''
                                    )}>
                                        {today ? t('forecast.today') : getDayName(dateStr)}
                                    </span>
                                </div>

                                <img
                                    src={`https://openweathermap.org/img/wn/${getWeatherIconFromCode(weatherCode)}@2x.png`}
                                    alt={getWeatherDescriptionFromCode(weatherCode)}
                                    className="w-8 h-8 flex-shrink-0"
                                />

                                <div className="w-12 flex-shrink-0 text-center">
                                    {pop > 10 && (
                                        <span className="text-xs text-blue-500 font-medium">
                                            {pop}%
                                        </span>
                                    )}
                                </div>

                                <span className="w-12 sm:w-14 text-sm text-slate-400 text-right flex-shrink-0 max-[1274px]:hidden">
                                    {formatTemperature(minTemp, 'metric', false)}°
                                </span>

                                <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full relative mx-2">
                                    <div
                                        className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 via-indigo-500 to-orange-400"
                                        style={{
                                            left: `${minPosition}%`,
                                            width: `${Math.max(barWidth, 10)}%`
                                        }}
                                    />
                                </div>

                                <span className="w-12 sm:w-14 text-sm font-medium text-right flex-shrink-0 max-[1274px]:hidden">
                                    {formatTemperature(maxTemp, 'metric', false)}°
                                </span>

                                <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                        );
                    })}
                </div>
            </Card>
        </motion.div>
    );
}

export default DailyForecast;
