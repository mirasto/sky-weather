import { motion } from 'framer-motion';
import { Gauge } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { selectCoordinates } from '@/store/slices/locationSlice';
import { useGetAirPollutionQuery } from '@/services/api/weatherApi';
import { WidgetSkeleton } from '@/components/ui';
import { getAQILevel } from '@/utils/helpers';

export function AirQualityIndex() {
    const { t } = useTranslation();
    const coordinates = useAppSelector(selectCoordinates);
    const { data, isLoading } = useGetAirPollutionQuery(coordinates);

    if (isLoading) return <WidgetSkeleton />;
    if (!data || !data.list?.[0]) return null;

    const aqi = data.list[0].main.aqi;
    const aqiInfo = getAQILevel(aqi);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full"
        >
            <div className="h-full">
                <div className="flex items-center gap-2 mb-2">
                    <Gauge className="w-5 h-5 text-indigo-500" />
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('weather.airQuality')}</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold" style={{ color: aqiInfo.color }}>
                        {aqi}
                    </span>
                    <span className="text-sm font-medium" style={{ color: aqiInfo.color }}>
                        {t(`aqiLevels.${aqiInfo.levelKey}`)}
                    </span>
                </div>
                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                    {t(`aqiAdvice.${aqiInfo.adviceKey}`)}
                </p>
            </div>
        </motion.div>
    );
}

export default AirQualityIndex;
