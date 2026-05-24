'use client';

import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  variant?: 'default' | 'orange' | 'green';
  description?: string;
}

const variantStyles = {
  default: 'border-gray-200 bg-white',
  orange: 'border-orange-200 bg-gradient-to-br from-orange-50 to-red-50',
  green: 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50',
};

const titleStyles = {
  default: 'text-gray-500',
  orange: 'text-orange-600',
  green: 'text-green-700',
};

const valueStyles = {
  default: 'text-gray-900',
  orange: 'text-orange-700',
  green: 'text-green-800',
};

export function StatCard({
  title,
  value,
  icon,
  variant = 'default',
  description,
}: StatCardProps) {
  return (
    <div className={`border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between gap-4 mb-2">
        <h3 className={`text-sm font-semibold uppercase tracking-wider ${titleStyles[variant]}`}>
          {title}
        </h3>
        {icon}
      </div>
      <p className={`text-3xl font-bold ${valueStyles[variant]}`}>{value}</p>
      {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
    </div>
  );
}
