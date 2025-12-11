import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/helpers';
import { Search } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    error?: string;
    label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, leftIcon, rightIcon, error, label, id, ...props }, ref) => {
        const inputId = id || `input-${Math.random().toString(36).slice(2)}`;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            {leftIcon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            'w-full px-4 py-3',
                            leftIcon && 'pl-12',
                            rightIcon && 'pr-12',
                            'bg-white/80 dark:bg-slate-800/80',
                            'border border-slate-200 dark:border-slate-700',
                            'rounded-xl',
                            'text-slate-900 dark:text-slate-100',
                            'placeholder-slate-400 dark:placeholder-slate-500',
                            'outline-none',
                            'transition-all duration-200',
                            'focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500',
                            error && 'border-red-500 focus:ring-red-500/50 focus:border-red-500',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            className
                        )}
                        aria-invalid={error ? 'true' : 'false'}
                        aria-describedby={error ? `${inputId}-error` : undefined}
                        {...props}
                    />
                    {rightIcon && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                            {rightIcon}
                        </span>
                    )}
                </div>
                {error && (
                    <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-500" role="alert">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
    onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    ({ className, onClear, value, ...props }, ref) => {
        return (
            <Input
                ref={ref}
                type="search"
                leftIcon={<Search className="w-5 h-5" />}
                className={cn('search-input', className)}
                rightIcon={
                    value && onClear ? (
                        <button
                            type="button"
                            onClick={onClear}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                            aria-label="Clear search"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    ) : undefined
                }
                value={value}
                {...props}
            />
        );
    }
);

SearchInput.displayName = 'SearchInput';

export default Input;
