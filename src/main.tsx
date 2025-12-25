import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import { store } from '@/store';
import { PageSkeleton } from '@/components/ui';
import '@/i18n';
import '@/styles/globals.css';

const HomePage = lazy(() => import('@/pages/Home'));
const ForecastPage = lazy(() => import('@/pages/Forecast'));
const DashboardPage = lazy(() => import('@/pages/Dashboard'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<PageSkeleton />}>
                        <HomePage />
                    </Suspense>
                )
            },
            {
                path: 'forecast',
                element: (
                    <Suspense fallback={<PageSkeleton />}>
                        <ForecastPage />
                    </Suspense>
                )
            },
            {
                path: 'dashboard',
                element: (
                    <Suspense fallback={<PageSkeleton />}>
                        <DashboardPage />
                    </Suspense>
                )
            }
        ]
    },
    {
        path: '*',
        element: (
            <Suspense fallback={<PageSkeleton />}>
                <NotFoundPage />
            </Suspense>
        )
    }
]);

const initializeTheme = () => {
    const savedTheme = localStorage.getItem('skyweather-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

initializeTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </React.StrictMode>
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((error) => {
            console.log('SW registration failed:', error);
        });
    });
}
