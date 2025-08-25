import {
  BadgeProps,
  RiskBadgeProps,
  StatusBadgeProps,
  TypeBadgeProps,
} from '@/types';
import clsx from 'clsx';

// Base Badge component
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) {
  const baseClasses =
    'inline-flex items-center gap-2 rounded-full border font-medium transition-colors';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  const variantClasses = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    risk: 'bg-red-100 text-red-700 border-red-200',
    status: 'bg-blue-100 text-blue-700 border-blue-200',
    type: 'bg-green-100 text-green-700 border-green-200',
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

// Risk Badge with score-based colors
export function RiskBadge({ score, size = 'md', className }: RiskBadgeProps) {
  const getRiskVariant = (score: number) => {
    if (score >= 70) return 'bg-red-100 text-red-700 border-red-200';
    if (score >= 40) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 70) return 'High Risk';
    if (score >= 40) return 'Moderate Risk';
    return 'Low Risk';
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 rounded-full border font-medium',
        sizeClasses[size],
        getRiskVariant(score),
        className
      )}
    >
      <span className="h-2 w-2 rounded-full bg-current opacity-60" />
      {getRiskLabel(score)} · {score}
    </span>
  );
}

// Status Badge with predefined status colors
export function StatusBadge({
  status,
  size = 'md',
  className,
}: StatusBadgeProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border font-medium',
        sizeClasses[size],
        getStatusVariant(status),
        className
      )}
    >
      {status}
    </span>
  );
}

// Type Badge with predefined type colors
export function TypeBadge({ type, size = 'md', className }: TypeBadgeProps) {
  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'project':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'profile':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'company':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border font-medium',
        sizeClasses[size],
        getTypeVariant(type),
        className
      )}
    >
      {type}
    </span>
  );
}
