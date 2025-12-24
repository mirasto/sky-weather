import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Cloud, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui';

export function NotFoundPage() {
    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-[60vh] flex items-center justify-center px-4"
        >
            <div className="text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                    className="mb-8"
                >
                    <Cloud className="w-24 h-24 mx-auto text-slate-300 dark:text-slate-600" />
                </motion.div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-6xl font-bold text-slate-300 dark:text-slate-600 mb-4"
                >
                    404
                </motion.h1>

                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-semibold mb-2"
                >
                    Page Not Found
                </motion.h2>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto"
                >
                    Looks like this page got lost in the clouds. Let's get you back on track.
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link to="/weather-app-vite">
                        <Button leftIcon={<Home className="w-4 h-4" />}>
                            Go Home
                        </Button>
                    </Link>
                    <Link to="/weather-app-vite/forecast">
                        <Button variant="secondary" leftIcon={<Search className="w-4 h-4" />}>
                            View Forecast
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </motion.main>
    );
}

export default NotFoundPage;
