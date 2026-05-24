'use client';

import { useDashboard } from '@/hooks/use-dashboard';
import { StatCard } from '@/components/dashboard/stat-card';
import { TopicsProgressCard } from '@/components/dashboard/topics-progress-card';
import { ActivityFeed } from '@/components/dashboard/activity-feed';

const SUBJECT_COLORS = ['#0f766e', '#2563eb', '#f97316', '#7c3aed', '#16a34a', '#db2777'];

export default function DashboardPage() {
  const { analytics, subjects, topics, progressList, isLoading, error, refresh } = useDashboard();

  const subjectChartData = (subjects || []).map((subject: any) => ({
    name: subject.title,
    value: Math.max(subject.progress ?? 0, 0),
  }));

  const averageSubjectProgress = subjectChartData.length
    ? Math.round(subjectChartData.reduce((sum, item) => sum + item.value, 0) / subjectChartData.length)
    : 0;

  if (isLoading) {
    return (
      <div className="font-sans animate-pulse">
        <h1 className="text-3xl font-bold mb-6 text-gray-300 bg-gray-300 w-48 h-8 rounded"></h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border p-6 rounded-2xl bg-gray-100 h-28"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg">
          <strong>Error loading dashboard:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <button 
          onClick={refresh} 
          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
        >
          Refresh Data
        </button>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <TopicsProgressCard
          topics={topics || []}
          subjects={subjects || []}
          colors={SUBJECT_COLORS}
        />

        <StatCard
          title="Study Streak"
          value={`${analytics?.streakCount ?? 0} Days 🔥`}
          variant="orange"
        />

        <StatCard
          title="Pending Tasks"
          value={analytics?.pendingTasks ?? 0}
        />

        <StatCard
          title="Completion Rate"
          value={`${analytics?.completionRate ?? 0}%`}
          variant="green"
        />
      </div>

      {/* Recent Activity Feed */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Recent Activity</h2>
        <ActivityFeed activities={(progressList as any)?.slice(0, 5) ?? []} />
      </div>
    </div>
  );
}
