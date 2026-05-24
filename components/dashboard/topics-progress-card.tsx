'use client';

import { DonutChart } from '@/components/ui/donut-chart';
import type { Subject } from '@/types/subject';
import type { Topic } from '@/types/topic';

interface TopicsProgressCardProps {
  topics: Topic[];
  subjects: Subject[];
  colors: string[];
}

export function TopicsProgressCard({
  topics,
  subjects,
  colors,
}: TopicsProgressCardProps) {
  // Create a map of subject ID to color
  const subjectColorMap: Record<string, string> = {};
  subjects.forEach((subject, index) => {
    subjectColorMap[subject.id] = colors[index % colors.length];
  });

  // Create a map of subject ID to name
  const subjectNameMap: Record<string, string> = {};
  subjects.forEach((subject) => {
    subjectNameMap[subject.id] = subject.title;
  });

  // Calculate topic progress - count completed topics
  const topicProgressMap: Record<string, { completed: number; total: number }> = {};

  topics.forEach((topic) => {
    if (!topicProgressMap[topic.subjectId]) {
      topicProgressMap[topic.subjectId] = { completed: 0, total: 0 };
    }

    topicProgressMap[topic.subjectId].total += 1;
    if (topic.status === 'Completed') {
      topicProgressMap[topic.subjectId].completed += 1;
    }
  });

  // Create chart data based on total topics per subject
  const totalTopicsAcrossSubjects = Object.values(topicProgressMap).reduce((sum, p) => sum + p.total, 0);
  
  const chartData = subjects
    .filter((subject) => topicProgressMap[subject.id] && topicProgressMap[subject.id].total > 0)
    .map((subject) => ({
      name: subject.title,
      value: Math.round((topicProgressMap[subject.id].total / totalTopicsAcrossSubjects) * 100),
    }));

  const totalProgress = chartData.length
    ? Math.round(chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length)
    : 0;

  const totalTopics = topics.length;
  const completedTopics = topics.filter((t) => t.status === 'Completed').length;

  if (topics.length === 0) {
    return (
      <div className="border border-slate-200 p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow md:col-span-2">
        <h3 className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-4">
          Topics Progress
        </h3>
        <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
          No topics yet
        </div>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow md:col-span-2">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-2">
            Topics Progress
          </h3>
          <p className="text-3xl font-bold text-slate-900">{totalTopics} topics</p>
          <p className="text-sm text-slate-500 mt-1">Colored by subject • {completedTopics} completed</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total Topics</p>
          <p className="text-2xl font-semibold text-slate-900">{totalTopics}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:items-center">
        <div className="h-64 w-64 shrink-0">
          <DonutChart
            data={chartData}
            colors={chartData.map((item) => {
              const subjectId = subjects.find((s) => s.title === item.name)?.id;
              return subjectId ? subjectColorMap[subjectId] : '#000000';
            })}
            centerText={{
              label: 'Total',
              value: `${totalTopics}`,
            }}
            height={260}
            showPercentage={false}
          />
        </div>

        <div className="space-y-3">
          {subjects.map((subject, index) => {
            const progress = topicProgressMap[subject.id];
            if (!progress) return null;

            const percentage = Math.round((progress.completed / progress.total) * 100);
            return (
              <div
                key={subject.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: subjectColorMap[subject.id] }}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{subject.title}</p>
                    <p className="text-xs text-slate-500">
                      {progress.completed} of {progress.total} topics completed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{percentage}%</p>
                  <p className="text-xs text-slate-500">completion rate</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
