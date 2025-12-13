import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Clock, X, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLocation } from '@/store/slices/locationSlice';
import { addRecentSearch, removeRecentSearch } from '@/store/slices/favoritesSlice';
import { cn, scrollToTop } from '@/utils/helpers';
import { fetchGeocodingSuggestions, type GeocodingResult } from '@/services/api/weatherApi';
import type { Coordinates } from '@/types';

interface SearchBarProps {
    className?: string;
    onLocationSelect?: (coords: Coordinates) => void;
}

export function SearchBar({ className, onLocationSelect }: SearchBarProps) {
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();
    const recentSearches = useAppSelector((state) =>
        (state.favorites as { recentSearches: Array<{ id: string; query: string; location: { city: string; country: string; coordinates: Coordinates } }> })?.recentSearches ?? []
    );

    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);

    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setIsLoading(true);
                try {
                    const response = await fetchGeocodingSuggestions(query, i18n.language);
                    setSuggestions(response.results || []);
                } catch (error) {
                    console.error('Geocoding error:', error);
                    setSuggestions([]);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, i18n.language]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setIsOpen(false);
                inputRef.current?.blur();
            }
        }
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    const handleSelect = (city: GeocodingResult) => {
        const description = `${city.name}, ${city.admin1 ? city.admin1 + ', ' : ''}${city.country}`;
        const location = {
            city: city.name,
            country: city.country,
            coordinates: { lat: city.latitude, lng: city.longitude }
        };

        dispatch(setLocation(location));
        dispatch(addRecentSearch({ query: description, location }));
        onLocationSelect?.(location.coordinates);
        scrollToTop();

        setQuery('');
        setSuggestions([]);
        setIsOpen(false);
    };

    const handleRecentSearchClick = (search: typeof recentSearches[number]) => {
        dispatch(setLocation(search.location));
        onLocationSelect?.(search.location.coordinates);
        scrollToTop();
        setIsOpen(false);
    };

    const handleRemoveRecent = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        dispatch(removeRecentSearch(id));
    };

    const showDropdown = isOpen && (suggestions.length > 0 || recentSearches.length > 0 || query.length === 0);

    return (
        <div ref={containerRef} className={cn('relative w-full', className)}>
            
            <div className="relative h-12">
                <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none z-10"
                    aria-hidden="true"
                />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    placeholder={t('search.placeholder')}
                    className={cn(
                        'absolute inset-0 w-full h-full pl-12 pr-10',
                        'bg-white/80 dark:bg-slate-800/80',
                        'backdrop-blur-lg',
                        'border border-slate-200 dark:border-slate-700',
                        'rounded-2xl',
                        'text-slate-900 dark:text-slate-100',
                        'placeholder-slate-400 dark:placeholder-slate-500',
                        'outline-none',
                        'transition-colors duration-200',
                        'focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500',
                        'disabled:opacity-50',
                        isOpen && showDropdown && 'rounded-b-none border-b-0'
                    )}
                    aria-label={t('search.placeholder')}
                    aria-expanded={isOpen}
                    role="combobox"
                />
                {(query || isLoading) && (
                    <button
                        type="button"
                        onClick={() => {
                            setQuery('');
                            setSuggestions([]);
                            inputRef.current?.focus();
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors z-10"
                        aria-label="Clear search"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <X className="w-4 h-4" />
                        )}
                    </button>
                )}
            </div>

            <AnimatePresence>
                {showDropdown && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                            'absolute z-50 w-full',
                            'bg-white dark:bg-slate-800',
                            'border border-t-0 border-slate-200 dark:border-slate-700',
                            'rounded-b-2xl',
                            'shadow-xl',
                            'max-h-72 overflow-y-auto'
                        )}
                        role="listbox"
                    >
                        
                        {suggestions.length > 0 && (
                            <div className="p-2">
                                {suggestions.map((city) => (
                                    <button
                                        key={city.id}
                                        onClick={() => handleSelect(city)}
                                        className={cn(
                                            'w-full flex items-center gap-3 p-3',
                                            'text-left text-sm',
                                            'rounded-xl',
                                            'hover:bg-slate-100 dark:hover:bg-slate-700',
                                            'transition-colors'
                                        )}
                                        role="option"
                                    >
                                        <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                                        <div className="flex flex-col truncate">
                                            <span className="text-slate-700 dark:text-slate-200 font-medium">
                                                {city.name}
                                            </span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {suggestions.length === 0 && recentSearches.length > 0 && (
                            <div className="p-2">
                                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    {t('search.recentSearches')}
                                </p>
                                {recentSearches.slice(0, 5).map((search) => (
                                    <button
                                        key={search.id}
                                        onClick={() => handleRecentSearchClick(search)}
                                        className={cn(
                                            'w-full flex items-center gap-3 p-3',
                                            'text-left text-sm',
                                            'rounded-xl',
                                            'hover:bg-slate-100 dark:hover:bg-slate-700',
                                            'transition-colors group'
                                        )}
                                        role="option"
                                    >
                                        <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                        <span className="text-slate-700 dark:text-slate-200 truncate flex-1">
                                            {search.query}
                                        </span>
                                        <button
                                            onClick={(e) => handleRemoveRecent(e, search.id)}
                                            className="p-1 opacity-0 group-hover:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-all"
                                            aria-label="Remove"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </button>
                                ))}
                            </div>
                        )}

                        {query.length < 2 && suggestions.length === 0 && recentSearches.length === 0 && (
                            <div className="p-4 text-center text-sm text-slate-500">
                                {t('search.typeToSearch')}
                            </div>
                        )}

                        {query.length >= 2 && suggestions.length === 0 && !isLoading && (
                            <div className="p-4 text-center text-slate-500">
                                <MapPin className="w-6 h-6 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">{t('search.noResults')}</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default SearchBar;
