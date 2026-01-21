import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    CurrentConditions,
    HourlyTrend,
    DailyForecast,
    WindConditions,
    UVIndex,
    AirQualityIndex,
    SolarSchedule,
    ApparentTemperature,
    HumidityLevel,
    VisibilityLevel,
    AtmosphericPressure
} from '@/components/weather';
import { staggerContainer, fadeInUp } from '@/types';

export function HomePage() {
    const { t } = useTranslation();

    return (
        <motion.main
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="container mx-auto px-4 py-6"
        >

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                <div className="lg:col-span-8 space-y-6">
                    <motion.div variants={fadeInUp}>
                        <CurrentConditions />
                    </motion.div>
                    
                    <motion.div variants={fadeInUp}>
                        <HourlyTrend />
                    </motion.div>
                </div>

                <motion.div variants={fadeInUp} className="lg:col-span-4">
                    <DailyForecast />
                </motion.div>
            </div>

            <motion.div variants={fadeInUp} className="mb-8">
                <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                    {t('weather.details')}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">

                    <div className="lg:col-span-4 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50 p-6 overflow-hidden flex flex-col gap-8">
                        <AirQualityIndex />
                        <hr className="border-slate-200 dark:border-slate-700" />
                        <SolarSchedule />
                    </div>

                    <div className="lg:col-span-4 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50 p-6 overflow-hidden flex flex-col gap-8">
                        <WindConditions />
                        <hr className="border-slate-200 dark:border-slate-700" />
                        <UVIndex />
                    </div>

                    <div className="lg:col-span-4 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50 p-6 overflow-hidden grid grid-cols-1 gap-4">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('weather.additionalMetrics')}</h3>
                        <ApparentTemperature />
                        <HumidityLevel />
                        <VisibilityLevel />
                        <AtmosphericPressure />
                    </div>
                </div>
            </motion.div>


        </motion.main>
    );
}

export default HomePage;
