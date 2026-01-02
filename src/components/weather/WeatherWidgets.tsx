import { motion } from 'framer-motion';
import { Thermometer, Droplets, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { selectCoordinates } from '@/store/slices/locationSlice';
import { useGetCurrentWeatherQuery } from '@/services/api/weatherApi';
import { WidgetSkeleton } from '@/components/ui';
import { formatTemperature, formatVisibility } from '@/utils/helpers';

export function ApparentTemperature() {
    const { t } = useTranslation();
    const coordinates = useAppSelector(selectCoordinates);
    const { data, isLoading } = useGetCurrentWeatherQuery(coordinates);

    if (isLoading) return <WidgetSkeleton />;
    if (!data) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-500/5"
        >
            <div className="p-2 rounded-lg bg-orange-500/10">
                <Thermometer className="w-5 h-5 text-orange-500" />
            </div>
            <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">{t('weather.feelsLike')}</span>
                <span className="text-xl font-bold">{formatTemperature(data.main.feels_like)}</span>
            </div>
        </motion.div>
    );
}

export function HumidityLevel() {
    const { t } = useTranslation();
    const coordinates = useAppSelector(selectCoordinates);
    const { data, isLoading } = useGetCurrentWeatherQuery(coordinates);

    if (isLoading) return <WidgetSkeleton />;
    if (!data) return null;

    const humidity = data.main.humidity;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-500/5"
        >
            <div className="p-2 rounded-lg bg-blue-500/10">
                <Droplets className="w-5 h-5 text-blue-500" />
            </div>
            <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">{t('weather.humidity')}</span>
                <span className="text-xl font-bold">{humidity}%</span>
            </div>
        </motion.div>
    );
}

export function VisibilityLevel() {
    const { t } = useTranslation();
    const coordinates = useAppSelector(selectCoordinates);
    const { data, isLoading } = useGetCurrentWeatherQuery(coordinates);

    if (isLoading) return <WidgetSkeleton />;
    if (!data) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-500/5"
        >
            <div className="p-2 rounded-lg bg-green-500/10">
                <Eye className="w-5 h-5 text-green-500" />
            </div>
            <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">{t('weather.visibility')}</span>
                <span className="text-xl font-bold">{formatVisibility(data.visibility)}</span>
            </div>
        </motion.div>
    );
}

export function AtmosphericPressure() {
    const { t } = useTranslation();
    const coordinates = useAppSelector(selectCoordinates);
    const { data, isLoading } = useGetCurrentWeatherQuery(coordinates);

    if (isLoading) return <WidgetSkeleton />;
    if (!data) return null;

    const pressure = data.main.pressure;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-500/5"
        >
            <div className="p-2 rounded-lg bg-purple-500/10">
                <svg className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="12" x2="12" y2="6" />
                </svg>
            </div>
            <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">{t('weather.pressure')}</span>
                <span className="text-xl font-bold">{pressure} hPa</span>
            </div>
        </motion.div>
    );
}
