import { type HTMLAttributes, forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/helpers';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'solid';
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variants = {
    default: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
    glass: 'backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50',
    solid: 'bg-slate-100 dark:bg-slate-900'
};

const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'glass', hover = true, padding = 'md', children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-2xl shadow-lg',
                    'transition-all duration-300',
                    hover && 'hover:shadow-xl hover:scale-[1.02]',
                    variants[variant],
                    paddings[padding],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    title?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
}

export function CardHeader({ title, icon, action, className, children, ...props }: CardHeaderProps) {
    return (
        <div className={cn('flex items-center justify-between mb-3', className)} {...props}>
            <div className="flex items-center gap-2">
                {icon && <span className="text-slate-500 dark:text-slate-400">{icon}</span>}
                {title && (
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {title}
                    </h3>
                )}
                {children}
            </div>
            {action}
        </div>
    );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('flex-1', className)} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('mt-4 pt-3 border-t border-slate-200 dark:border-slate-700', className)} {...props}>
            {children}
        </div>
    );
}

export function MotionCard({
    children,
    className,
    delay = 0,
    ...props
}: HTMLMotionProps<'div'> & { className?: string; delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay }}
            whileHover={{ scale: 1.02 }}
            className={cn(
                'rounded-2xl shadow-lg',
                'backdrop-blur-xl bg-white/70 dark:bg-slate-800/70',
                'border border-white/20 dark:border-slate-700/50',
                'p-4',
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export default Card;
