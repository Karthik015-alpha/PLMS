'use client';

import { useEffect, useState } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface DonutChartProps {
  data: Array<{ name: string; value: number }>;
  colors: string[];
  centerText?: {
    label: string;
    value: string;
  };
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showPercentage?: boolean;
}

const CustomTooltip = ({ active, payload, showPercentage }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg bg-white dark:bg-slate-900 p-3 shadow-xl border border-slate-200 dark:border-slate-800 z-50" style={{
        position: 'absolute',
        pointerEvents: 'none'
      }}>
        <p className="font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">{data.name}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
          {showPercentage ? `${data.value}%` : `${data.value} topics`}
        </p>
      </div>
    );
  }
  return null;
};

export function DonutChart({
  data,
  colors,
  centerText,
  height = 300,
  innerRadius = 74,
  outerRadius = 104,
  showPercentage = false,
}: DonutChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="relative mx-auto w-full" style={{ height }} />;
  }

  return (
    <div className="relative mx-auto w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={4}
            stroke="transparent"
          >
            {data.map((entry, index) => (
              <Cell key={`slice-${entry.name}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip 
            content={<CustomTooltip showPercentage={showPercentage} />}
            cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
            position={{ x: 10, y: 10 }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
        </PieChart>
      </ResponsiveContainer>

      {centerText && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-white dark:bg-slate-900 px-6 py-5 text-center shadow-sm ring-1 ring-slate-100 dark:ring-slate-800">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{centerText.label}</p>
            <p className="mt-1 text-4xl font-bold text-slate-900 dark:text-slate-100">{centerText.value}</p>
          </div>
        </div>
      )}
    </div>
  );
}
