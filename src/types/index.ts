export * from './weather';

export type Theme = 'light' | 'dark' | 'system';

export type Language = 'en' | 'uk';

export type TemperatureUnit = 'metric' | 'imperial';

export interface SelectOption<T = string> {
    value: T;
    label: string;
    icon?: React.ReactNode;
}

export interface ToastMessage {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
}

export interface LoadingState {
    isLoading: boolean;
    error: string | null;
}

export interface BaseComponentProps {
    className?: string;
    children?: React.ReactNode;
}

export interface CardProps extends BaseComponentProps {
    title?: string;
    icon?: React.ReactNode;
    loading?: boolean;
}

export const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
};

export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
};

export const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
};

export const slideInFromRight = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
};

export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};
