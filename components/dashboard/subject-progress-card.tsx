'use client';

import { DonutChart } from '@/components/ui/donut-chart';

interface SubjectProgressCardProps {
  data: Array<{ name: string; value: number }>;
  colors: string[];
  averageProgress: number;
  totalSubjects: number;
}

export function SubjectProgressCard({
  data,
  colors,
  averageProgress,
  totalSubjects,
}: SubjectProgressCardProps) {
  if (data.length === 0) {
    return (
      <div className="border border-slate-200 p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow md:col-span-2">
        <h3 className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-4">
          Subject Progress
        </h3>
        <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
          No subject data yet
        </div>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow md:col-span-2">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-2">
            Subject Progress
          </h3>
          <p className="text-3xl font-bold text-slate-900">{totalSubjects} subjects</p>
          <p className="text-sm text-slate-500 mt-1">Chart fills by topic completion per subject</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Avg progress</p>
          <p className="text-2xl font-semibold text-slate-900">{averageProgress}%</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:items-center">
        <div className="h-64 w-64 shrink-0">
          <DonutChart
            data={data}
            colors={colors}
            centerText={{
              label: 'Average',
              value: `${averageProgress}%`,
            }}
            height={260}
          />
        </div>

        <div className="space-y-3">
          {data.map((segment, index) => (
            <div
              key={segment.name}
              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{segment.name}</p>
                  <p className="text-xs text-slate-500">Topic progress contribution</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{segment.value}%</p>
                <p className="text-xs text-slate-500">of subject progress</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
