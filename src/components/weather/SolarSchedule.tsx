import { motion } from 'framer-motion';
import { Sunrise, Sunset } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { selectCoordinates } from '@/store/slices/locationSlice';
import { useGetCurrentWeatherQuery } from '@/services/api/weatherApi';
import { WidgetSkeleton } from '@/components/ui';
import { formatTime } from '@/utils/helpers';

export function SolarSchedule() {
    const { t } = useTranslation();
    const coordinates = useAppSelector(selectCoordinates);
    const { data, isLoading } = useGetCurrentWeatherQuery(coordinates);

    if (isLoading) return <WidgetSkeleton />;
    if (!data) return null;

    const sunrise = data.sys.sunrise;
    const sunset = data.sys.sunset;
    const timezone = data.timezone;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full"
        >
            <div className="h-full">
                <div className="flex items-center gap-2 mb-4">
                    <Sunrise className="w-5 h-5 text-amber-500" />
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('weather.solarSchedule')}</span>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-500/5">
                        <div className="flex items-center gap-2">
                            <Sunrise className="w-4 h-4 text-amber-500" />
                            <span className="text-xs text-slate-500">{t('weather.sunrise')}</span>
                        </div>
                        <span className="text-sm font-bold">{formatTime(sunrise, timezone)}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-500/5">
                        <div className="flex items-center gap-2">
                            <Sunset className="w-4 h-4 text-orange-500" />
                            <span className="text-xs text-slate-500">{t('weather.sunset')}</span>
                        </div>
                        <span className="text-sm font-bold">{formatTime(sunset, timezone)}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default SolarSchedule;
