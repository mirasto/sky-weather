import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { selectCoordinates } from '@/store/slices/locationSlice';
import { WidgetSkeleton } from '@/components/ui';
import { fetchUVIndex } from '@/services/api/weatherApi';
import { getUVLevel } from '@/utils/helpers';
import type { UVIndexResponse } from '@/types';

export function UVIndex() {
    const { t } = useTranslation();
    const coordinates = useAppSelector(selectCoordinates);
    const [data, setData] = useState<UVIndexResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const response = await fetchUVIndex(coordinates.lat, coordinates.lng);
                setData(response);
            } catch (error) {
                console.error('Error fetching UV index:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [coordinates.lat, coordinates.lng]);

    if (isLoading) return <WidgetSkeleton />;
    if (!data || !data.daily?.uv_index_max?.[0]) return null;

    const uvIndex = Math.round(data.daily.uv_index_max[0]);
    const uvInfo = getUVLevel(uvIndex);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full"
        >
            <div className="h-full">
                <div className="flex items-center gap-2 mb-4">
                    <Sun className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('weather.uvIndex')}</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{uvIndex}</span>
                    <span className="text-lg font-medium" style={{ color: uvInfo.color }}>
                        {uvInfo.level}
                    </span>
                </div>
                <div className="mt-4 h-2 bg-slate-500/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(uvIndex / 12) * 100}%` }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: uvInfo.color }}
                    />
                </div>
            </div>
        </motion.div>
    );
}

export default UVIndex;
