import { PillProps } from '@/types';
import clsx from 'clsx';

export function Pill({
  children,
  variant = 'default',
  size = 'md',
  className,
}: PillProps) {
  const baseClasses =
    'inline-flex items-center rounded-full border font-mono transition-colors';

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const variantClasses = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    success: 'bg-green-100 text-green-700 border-green-200',
    error: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <span
      className={clsx(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
