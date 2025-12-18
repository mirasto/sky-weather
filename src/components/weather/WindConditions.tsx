import { motion } from 'framer-motion';
import { Wind as WindIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { selectCoordinates } from '@/store/slices/locationSlice';
import { useGetCurrentWeatherQuery } from '@/services/api/weatherApi';
import { WidgetSkeleton } from '@/components/ui';
import { formatWindSpeed, getWindDirection } from '@/utils/helpers';

export function WindConditions() {
    const { t } = useTranslation();
    const coordinates = useAppSelector(selectCoordinates);
    const { data, isLoading } = useGetCurrentWeatherQuery(coordinates);

    if (isLoading) return <WidgetSkeleton />;
    if (!data) return null;

    const windSpeed = data.wind.speed;
    const windDeg = data.wind.deg;
    const direction = getWindDirection(windDeg);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full"
        >
            <div className="h-full">
                <div className="flex items-center gap-2 mb-4">
                    <WindIcon className="w-5 h-5 text-teal-500" />
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('weather.wind')}</span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{formatWindSpeed(windSpeed)}</span>
                    <span className="text-sm text-slate-400">m/s</span>
                </div>
                <div className="mt-2 text-sm font-medium text-teal-600 dark:text-teal-400 flex items-center gap-1">
                    <span className="rotate-0" style={{ transform: `rotate(${windDeg}deg)` }}>↓</span>
                    {direction}
                </div>
            </div>
        </motion.div>
    );
}

export default WindConditions;
