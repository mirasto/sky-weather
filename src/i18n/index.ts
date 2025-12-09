import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import uk from './locales/uk.json';
import { STORAGE_KEYS } from '@/utils/constants';

const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            uk: { translation: uk }
        },
        lng: savedLanguage,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        },
        react: {
            useSuspense: false
        }
    });

export default i18n;

export const changeLanguage = (lang: 'en' | 'uk'): void => {
    i18n.changeLanguage(lang);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    document.documentElement.setAttribute('lang', lang);
};

export const getCurrentLanguage = (): string => {
    return i18n.language || 'en';
};
