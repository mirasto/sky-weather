import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/store/hooks';
import { setLocation } from '@/store/slices/locationSlice';
import { useGetCurrentWeatherQuery } from '@/services/api/weatherApi';
import { formatTemperature, getWeatherIconUrl, scrollToTop, cn } from '@/utils/helpers';
import { POPULAR_CITIES } from '@/utils/constants';
import type { Coordinates } from '@/types';

interface LocationCardProps {
    city: string;
    country: string;
    coordinates: Coordinates;
    onSelect?: () => void;
}

function LocationCard({ city, country, coordinates, onSelect }: LocationCardProps) {
    const dispatch = useAppDispatch();
    const { data, isLoading, isError } = useGetCurrentWeatherQuery(coordinates);

    const handleClick = () => {
        dispatch(setLocation({
            city,
            country,
            coordinates
        }));
        scrollToTop();
        onSelect?.();
    };

    if (isLoading) {
        return (
            <div className="glass-card p-4 flex items-center gap-3">
                <div className="skeleton w-12 h-12 rounded-full" />
                <div className="flex-1">
                    <div className="skeleton w-24 h-4 mb-2" />
                    <div className="skeleton w-16 h-3" />
                </div>
                <div className="skeleton w-12 h-8" />
            </div>
        );
    }

    if (isError || !data) {
        return null;
    }

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClick}
            className={cn(
                'w-full glass-card p-4',
                'flex items-center gap-4',
                'text-left',
                'transition-all duration-200',
                'hover:shadow-xl',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500/50'
            )}
        >
            
            <img
                src={getWeatherIconUrl(data.weather[0]?.icon || '01d', '2x')}
                alt={data.weather[0]?.description || 'Weather'}
                className="w-12 h-12"
            />

            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                    {city}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {country}
                </p>
            </div>

            <div className="text-right">
                <div className="text-2xl font-bold">
                    {formatTemperature(data.main.temp, 'metric', false)}°
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                    {data.weather[0]?.description}
                </p>
            </div>
        </motion.button>
    );
}

export function PopularLocations() {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            <div className="mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-slate-500" />
                <h2 className="text-lg font-semibold">{t('search.popularCities')}</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                {POPULAR_CITIES.map((city, index) => (
                    <motion.div
                        key={`${city.city}-${city.country}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                    >
                        <LocationCard
                            city={city.city}
                            country={city.country}
                            coordinates={{ lat: city.lat, lng: city.lng }}
                        />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

export { LocationCard };
export default PopularLocations;
