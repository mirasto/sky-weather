import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout';
import { PageSkeleton } from '@/components/ui';

function App() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
            
            <Header />

            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1"
                >
                    <Suspense fallback={<PageSkeleton />}>
                        <Outlet />
                    </Suspense>
                </motion.div>
            </AnimatePresence>

            <footer className="py-4 text-center text-xs text-slate-400 dark:text-slate-500">
                <p>© {new Date().getFullYear()} SkyWeather developed by <a href="https://github.com/mirasto" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">mirasto</a></p>
            </footer>
        </div>
    );
}

export default App;
