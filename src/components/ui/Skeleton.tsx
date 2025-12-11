import { cn } from '@/utils/helpers';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
    className,
    variant = 'rectangular',
    width,
    height,
    animation = 'pulse'
}: SkeletonProps) {
    const variantStyles = {
        text: 'rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg'
    };

    const animationStyles = {
        pulse: 'animate-pulse',
        wave: 'animate-shimmer',
        none: ''
    };

    return (
        <div
            className={cn(
                'bg-slate-200 dark:bg-slate-700',
                variantStyles[variant],
                animationStyles[animation],
                className
            )}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height
            }}
        />
    );
}

export function WeatherCardSkeleton() {
    return (
        <div className="glass-card p-4 space-y-4">
            <div className="flex items-center gap-2">
                <Skeleton variant="circular" width={16} height={16} />
                <Skeleton variant="text" width={80} height={12} />
            </div>
            <div className="space-y-2">
                <Skeleton variant="text" width={120} height={32} />
                <Skeleton variant="text" width={80} height={16} />
            </div>
            <Skeleton variant="rectangular" width="100%" height={40} />
        </div>
    );
}

export function HourlyForecastSkeleton() {
    return (
        <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-4">
                <Skeleton variant="circular" width={16} height={16} />
                <Skeleton variant="text" width={120} height={12} />
            </div>
            <div className="flex gap-4 overflow-hidden">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 min-w-[60px]">
                        <Skeleton variant="text" width={40} height={12} />
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="text" width={30} height={16} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function WidgetSkeleton() {
    return (
        <div className="glass-card p-4 h-40">
            <div className="flex items-center gap-2 mb-3">
                <Skeleton variant="circular" width={16} height={16} />
                <Skeleton variant="text" width={60} height={12} />
            </div>
            <Skeleton variant="text" width={80} height={28} className="mb-2" />
            <Skeleton variant="text" width={100} height={14} />
        </div>
    );
}

export function SearchResultSkeleton() {
    return (
        <div className="p-3 flex items-center gap-3">
            <Skeleton variant="circular" width={20} height={20} />
            <div className="flex-1 space-y-1">
                <Skeleton variant="text" width="60%" height={14} />
                <Skeleton variant="text" width="40%" height={12} />
            </div>
        </div>
    );
}

export function PageSkeleton() {
    return (
        <div className="container mx-auto px-4 py-6 space-y-6 animate-fade-in">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                    <WeatherCardSkeleton />
                    <HourlyForecastSkeleton />
                </div>
                <div className="md:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <WidgetSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Skeleton;
