import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    TrendingUp,
    Calendar,
    MapPin,
    Clock,
    Thermometer,
    Droplets,
    Wind,
    Sun
} from 'lucide-react';
import {
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
    Area,
    AreaChart
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { selectCoordinates, selectLocation } from '@/store/slices/locationSlice';
import {
    useGetCurrentWeatherQuery,
    useGetHourlyForecastQuery,
    fetchDailyForecast,
    type OpenMeteoDailyResponse
} from '@/services/api/weatherApi';
import { Card, CardHeader, PageSkeleton } from '@/components/ui';
import { formatTime, cn } from '@/utils/helpers';
import i18n from '@/i18n';

export function DashboardPage() {
    const { t } = useTranslation();
    const coordinates = useAppSelector(selectCoordinates);
    const location = useAppSelector(selectLocation);
    
    const favoritesCount = useAppSelector((state) => (state.favorites as any)?.cities?.length ?? 0);
    const recentSearchesCount = useAppSelector((state) => (state.favorites as any)?.recentSearches?.length ?? 0);

    const { data: currentWeather, isLoading: weatherLoading } = useGetCurrentWeatherQuery(coordinates);
    const { data: hourlyData, isLoading: hourlyLoading } = useGetHourlyForecastQuery(coordinates);
    const [dailyData, setDailyData] = useState<OpenMeteoDailyResponse | null>(null);

    useEffect(() => {
        fetchDailyForecast(coordinates.lat, coordinates.lng)
            .then(setDailyData)
            .catch(console.error);
    }, [coordinates.lat, coordinates.lng]);

    if (weatherLoading || hourlyLoading) {
        return <PageSkeleton />;
    }

    const temperatureChartData = hourlyData?.list.slice(0, 12).map((hour) => ({
        time: formatTime(hour.dt, hourlyData.city.timezone, { hour: 'numeric' }),
        temp: Math.round(hour.main.temp),
        feels: Math.round(hour.main.feels_like)
    })) || [];

    const precipitationChartData = hourlyData?.list.slice(0, 8).map((hour) => ({
        time: formatTime(hour.dt, hourlyData.city.timezone, { hour: 'numeric' }),
        probability: Math.round(hour.pop * 100),
        rain: hour.rain?.['3h'] || 0
    })) || [];

    const weeklyTempData = dailyData?.daily.time.slice(0, 7).map((date, i) => ({
        day: new Date(date).toLocaleDateString(i18n.language, { weekday: 'short' }),
        high: Math.round(dailyData.daily.temperature_2m_max[i]),
        low: Math.round(dailyData.daily.temperature_2m_min[i])
    })) || [];

    const stats = [
        {
            icon: Thermometer,
            label: t('dashboard.currentTemp'),
            value: currentWeather ? `${Math.round(currentWeather.main.temp)}°C` : '--',
            change: currentWeather ? `${t('dashboard.feels')} ${Math.round(currentWeather.main.feels_like)}°` : '',
            color: 'text-orange-500'
        },
        {
            icon: Droplets,
            label: t('weather.humidity'),
            value: currentWeather ? `${currentWeather.main.humidity}%` : '--',
            change: (currentWeather?.main.humidity ?? 0) > 60 ? t('dashboard.high') : t('dashboard.normal'),
            color: 'text-blue-500'
        },
        {
            icon: Wind,
            label: t('weather.windSpeed'),
            value: currentWeather ? `${currentWeather.wind.speed} m/s` : '--',
            change: currentWeather?.wind.gust ? `${t('dashboard.gusts')} ${currentWeather.wind.gust}` : '',
            color: 'text-green-500'
        },
        {
            icon: Sun,
            label: t('weather.visibility'),
            value: currentWeather ? `${(currentWeather.visibility / 1000).toFixed(1)} km` : '--',
            change: currentWeather && currentWeather.visibility >= 10000 ? t('dashboard.excellent') : t('dashboard.good'),
            color: 'text-amber-500'
        }
    ];

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
                <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="w-8 h-8 text-indigo-500" />
                    <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
                </div>
                <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {location.city}, {location.country}
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <Clock className="w-4 h-4" />
                    {new Date().toLocaleDateString(i18n.language, { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="relative overflow-hidden">
                            <div className={cn('absolute top-0 right-0 w-20 h-20 -mr-4 -mt-4 rounded-full opacity-10', stat.color.replace('text-', 'bg-'))} />
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className={cn('text-xs mt-1', stat.color)}>{stat.change}</p>
                                </div>
                                <stat.icon className={cn('w-8 h-8', stat.color)} />
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardHeader
                            title={t('dashboard.tempTrend')}
                            icon={<TrendingUp className="w-4 h-4" />}
                        />
                        <div className="h-64 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={temperatureChartData}>
                                    <defs>
                                        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#f97316" stopOpacity={0.4} />
                                            <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="time"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                                        tickFormatter={(v) => `${v}°`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            borderRadius: '12px',
                                            border: 'none',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="temp"
                                        stroke="#f97316"
                                        strokeWidth={2}
                                        fill="url(#tempGradient)"
                                        name={t('charts.temperature')}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="feels"
                                        stroke="#94a3b8"
                                        strokeWidth={1}
                                        strokeDasharray="5 5"
                                        dot={false}
                                        name={t('charts.feelsLike')}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardHeader
                            title={t('dashboard.precipProb')}
                            icon={<Droplets className="w-4 h-4" />}
                        />
                        <div className="h-64 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={precipitationChartData}>
                                    <XAxis
                                        dataKey="time"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                                        tickFormatter={(v) => `${v}%`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            borderRadius: '12px',
                                            border: 'none',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                        }}
                                    />
                                    <Bar
                                        dataKey="probability"
                                        fill="#3b82f6"
                                        radius={[4, 4, 0, 0]}
                                        name={t('charts.probability')}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2"
                >
                    <Card>
                        <CardHeader
                            title={t('dashboard.weeklyTemp')}
                            icon={<Calendar className="w-4 h-4" />}
                        />
                        <div className="h-64 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyTempData} layout="vertical">
                                    <XAxis
                                        type="number"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                                        tickFormatter={(v) => `${v}°`}
                                    />
                                    <YAxis
                                        dataKey="day"
                                        type="category"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            borderRadius: '12px',
                                            border: 'none',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                        }}
                                    />
                                    <Bar dataKey="low" fill="#3b82f6" radius={[4, 0, 0, 4]} name={t('charts.low')} />
                                    <Bar dataKey="high" fill="#f97316" radius={[0, 4, 4, 0]} name={t('charts.high')} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card>
                        <CardHeader
                            title={t('dashboard.yourActivity')}
                            icon={<BarChart3 className="w-4 h-4" />}
                        />
                        <div className="space-y-4 mt-4">
                            <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700/50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-indigo-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{t('dashboard.savedCities')}</p>
                                        <p className="text-sm text-slate-500">{favoritesCount} {t('dashboard.locations')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700/50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{t('dashboard.recentSearches')}</p>
                                        <p className="text-sm text-slate-500">{recentSearchesCount} {t('dashboard.queries')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700/50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{t('dashboard.thisWeek')}</p>
                                        <p className="text-sm text-slate-500">{t('dashboard.forecastLoaded')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </motion.main>
    );
}

export default DashboardPage;
