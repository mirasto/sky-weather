import { motion } from 'framer-motion';
import { CloudRain } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { selectCoordinates } from '@/store/slices/locationSlice';
import { useGetHourlyForecastQuery } from '@/services/api/weatherApi';
import { Card, CardHeader, WidgetSkeleton } from '@/components/ui';
import { formatTime } from '@/utils/helpers';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Area,
    Tooltip
} from 'recharts';

export function RainProbability() {
    const { t } = useTranslation();
    const coordinates = useAppSelector(selectCoordinates);

    const { data, isLoading } = useGetHourlyForecastQuery(coordinates);

    if (isLoading) {
        return <WidgetSkeleton />;
    }

    if (!data) {
        return null;
    }

    const chartData = data.list.slice(0, 8).map((hour) => ({
        time: formatTime(hour.dt, data.city.timezone, { hour: 'numeric' }),
        probability: Math.round(hour.pop * 100),
        rain: hour.rain?.['3h'] || 0
    }));

    const maxProbability = Math.max(...chartData.map(d => d.probability));
    const avgProbability = Math.round(
        chartData.reduce((sum, d) => sum + d.probability, 0) / chartData.length
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="col-span-2"
        >
            <Card className="h-48">
                <CardHeader
                    title={t('weather.chanceOfRain')}
                    icon={<CloudRain className="w-4 h-4" />}
                    action={
                        <span className="text-sm font-medium text-blue-500">
                            Max: {maxProbability}%
                        </span>
                    }
                />

                <div className="h-28 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                            <defs>
                                <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="time"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#94a3b8' }}
                            />
                            <YAxis
                                domain={[0, 100]}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#94a3b8' }}
                                tickFormatter={(value) => `${value}%`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                                labelStyle={{ fontWeight: 600 }}
                                formatter={(value: number) => [`${value}%`, 'Probability']}
                            />
                            <Area
                                type="monotone"
                                dataKey="probability"
                                stroke="none"
                                fill="url(#rainGradient)"
                            />
                            <Line
                                type="monotone"
                                dataKey="probability"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4, fill: '#3b82f6' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {avgProbability > 50 && (
                    <p className="text-xs text-blue-500 mt-1">
                        ☔ High chance of rain expected
                    </p>
                )}
            </Card>
        </motion.div>
    );
}

export default RainProbability;
