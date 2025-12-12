import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Sun,
    Moon,
    Monitor,
    Menu,
    X,
    Settings,
    Globe
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SearchBar } from './SearchBar';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTheme, selectTheme, setLanguage, selectLanguage } from '@/store/slices/settingsSlice';
import { cn } from '@/utils/helpers';
import type { Theme, Language } from '@/types';

export function Header() {
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();
    const location = useLocation();
    const currentTheme = useAppSelector(selectTheme);
    const currentLanguage = useAppSelector(selectLanguage);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleThemeChange = (theme: Theme) => {
        dispatch(setTheme(theme));
    };

    const handleLanguageChange = (lang: Language) => {
        dispatch(setLanguage(lang));
        i18n.changeLanguage(lang);
    };

    const themeOptions = [
        { value: 'light' as Theme, icon: Sun, label: t('settings.light') },
        { value: 'dark' as Theme, icon: Moon, label: t('settings.dark') },
        { value: 'system' as Theme, icon: Monitor, label: t('settings.system') }
    ];

    const navLinks = [
        { path: '/', label: t('common.home') },
        { path: '/forecast', label: t('common.forecast') },
        { path: '/dashboard', label: t('common.dashboard') }
    ];

    return (
        <header className="sticky top-0 z-40 w-full">
            <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50" />

            <div className="relative container mx-auto px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                    <Link
                        to="/"
                        className="flex items-center gap-2 group flex-shrink-0"
                        aria-label="SkyWeather Home"
                    >
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25"
                        >
                            <Sun className="w-5 h-5 text-white" />
                        </motion.div>
                        <span className="text-xl font-bold gradient-text hidden sm:block">
                            SkyWeather
                        </span>
                    </Link>

                    <div className="hidden md:block flex-1 max-w-lg mx-4">
                        <SearchBar />
                    </div>

                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={cn(
                                    'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                                    location.pathname === link.path
                                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        
                        <button
                            onClick={() => handleLanguageChange(currentLanguage === 'en' ? 'uk' : 'en')}
                            className="btn-icon hidden sm:flex items-center gap-1"
                            aria-label="Change language"
                        >
                            <Globe className="w-5 h-5" />
                            <span className="text-xs font-medium uppercase">
                                {currentLanguage}
                            </span>
                        </button>

                        <div className="relative hidden sm:block">
                            <button
                                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                className="btn-icon"
                                aria-label="Settings"
                                aria-expanded={isSettingsOpen}
                            >
                                <Settings className={cn('w-5 h-5 transition-transform', isSettingsOpen && 'rotate-90')} />
                            </button>

                            {isSettingsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2"
                                >
                                    <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        {t('settings.theme')}
                                    </p>
                                    {themeOptions.map(({ value, icon: Icon, label }) => (
                                        <button
                                            key={value}
                                            onClick={() => handleThemeChange(value)}
                                            className={cn(
                                                'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                                                currentTheme === value
                                                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                                                    : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                                            )}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="text-sm">{label}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </div>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="btn-icon lg:hidden"
                            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isMobileMenuOpen}
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <div className="mt-4 md:hidden">
                    <SearchBar />
                </div>
            </div>

            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative lg:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700"
                >
                    <nav className="container mx-auto px-4 py-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    'block px-4 py-3 rounded-xl text-base font-medium transition-colors',
                                    location.pathname === link.path
                                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                            <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                {t('settings.theme')}
                            </p>
                            <div className="flex gap-2 px-4">
                                {themeOptions.map(({ value, icon: Icon, label }) => (
                                    <button
                                        key={value}
                                        onClick={() => handleThemeChange(value)}
                                        className={cn(
                                            'flex-1 flex flex-col items-center gap-1 p-3 rounded-xl transition-colors',
                                            currentTheme === value
                                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                                                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                                        )}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="text-xs">{label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 px-4">
                            <p className="py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                {t('settings.language')}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleLanguageChange('en')}
                                    className={cn(
                                        'flex-1 py-2 rounded-xl text-sm font-medium transition-colors',
                                        currentLanguage === 'en'
                                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                                            : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                                    )}
                                >
                                    English
                                </button>
                                <button
                                    onClick={() => handleLanguageChange('uk')}
                                    className={cn(
                                        'flex-1 py-2 rounded-xl text-sm font-medium transition-colors',
                                        currentLanguage === 'uk'
                                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                                            : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                                    )}
                                >
                                    Українська
                                </button>
                            </div>
                        </div>
                    </nav>
                </motion.div>
            )}
        </header>
    );
}

export default Header;
