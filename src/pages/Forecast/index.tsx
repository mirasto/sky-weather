import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { selectCoordinates, selectLocation } from '@/store/slices/locationSlice';
import {
    fetchDailyForecast,
    getWeatherIconFromCode,
    type OpenMeteoDailyResponse
} from '@/services/api/weatherApi';
import { Card, CardHeader, PageSkeleton } from '@/components/ui';
import { DailyForecast, HourlyTrend } from '@/components/weather';
import { formatTemperature, cn } from '@/utils/helpers';

import i18n from '@/i18n';

export function ForecastPage() {
    const { t } = useTranslation();
    const coordinates = useAppSelector(selectCoordinates);
    const location = useAppSelector(selectLocation);
    const [dailyData, setDailyData] = useState<OpenMeteoDailyResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchDailyForecast(coordinates.lat, coordinates.lng);
                setDailyData(data);
            } catch (error) {
                console.error('Error loading forecast:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [coordinates.lat, coordinates.lng]);

    if (isLoading) {
        return <PageSkeleton />;
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString(i18n.language, {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto px-4 py-6"
        >
            
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold mb-2">
                    {t('forecast.daily')}
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    {t('forecast.title')} {location.city}, {location.country}
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-3"
                >
                    <HourlyTrend />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2"
                >
                    <DailyForecast />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                >
                    
                    <Card>
                        <CardHeader
                            title={t('forecast.weeklyOverview')}
                            icon={<TrendingUp className="w-4 h-4" />}
                        />

                        {dailyData && (
                            <div className="space-y-4">
                                
                                <div>
                                    <p className="text-sm text-slate-500 mb-2">{t('forecast.tempRange')}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-blue-500">
                                            {formatTemperature(
                                                Math.min(...dailyData.daily.temperature_2m_min.slice(0, 7)),
                                                'metric',
                                                false
                                            )}°
                                        </span>
                                        <div className="flex-1 h-2 mx-4 rounded-full bg-gradient-to-r from-blue-400 via-green-400 to-orange-400" />
                                        <span className="text-2xl font-bold text-orange-500">
                                            {formatTemperature(
                                                Math.max(...dailyData.daily.temperature_2m_max.slice(0, 7)),
                                                'metric',
                                                false
                                            )}°
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-slate-500 mb-2">{t('forecast.rainyDays')}</p>
                                    <div className="flex gap-1">
                                        {dailyData.daily.time.slice(0, 7).map((dateStr, i) => (
                                            <div
                                                key={dateStr}
                                                className={cn(
                                                    'flex-1 h-8 rounded-lg flex items-center justify-center text-xs',
                                                    dailyData.daily.precipitation_probability_max[i] > 30
                                                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                                                        : 'bg-slate-100 dark:bg-slate-800'
                                                )}
                                            >
                                                {dailyData.daily.precipitation_probability_max[i] > 30 ? '💧' : '☀'}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>

                    {dailyData && dailyData.daily.time.slice(7, 10).map((dateStr, index) => (
                        <motion.div
                            key={dateStr}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                        >
                            <Card className="flex items-center gap-4">
                                <img
                                    src={`https://openweathermap.org/img/wn/${getWeatherIconFromCode(dailyData.daily.weathercode[7 + index])}@2x.png`}
                                    alt="Weather"
                                    className="w-14 h-14"
                                />
                                <div className="flex-1">
                                    <p className="font-semibold">{formatDate(dateStr)}</p>
                                    <p className="text-sm text-slate-500 capitalize">
                                        {dailyData.daily.precipitation_probability_max[7 + index] > 30 ? t('forecast.chanceRain') : t('forecast.clear')}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold">
                                        {formatTemperature(dailyData.daily.temperature_2m_max[7 + index], 'metric', false)}°
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        {formatTemperature(dailyData.daily.temperature_2m_min[7 + index], 'metric', false)}°
                                    </p>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.main>
    );
}

export default ForecastPage;
