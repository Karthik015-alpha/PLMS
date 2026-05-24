"use client";

import { useDashboard } from '@/hooks/use-dashboard';

export default function DashboardPage() {
  const { analytics, progressList, isLoading, error, refresh } = useDashboard();

  if (isLoading) {
    return (
      <div className="p-8 max-w-6xl mx-auto font-sans animate-pulse">
        <h1 className="text-3xl font-bold mb-6 text-gray-300 bg-gray-300 w-48 h-8 rounded"></h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border p-6 rounded-xl bg-gray-100 h-28"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg">
          <strong>Error loading dashboard:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <button 
          onClick={refresh} 
          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
        >
          Refresh Data
        </button>
      </div>
      
      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="border border-gray-200 p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-2">Total Subjects</h3>
          <p className="text-3xl font-bold text-gray-900">{analytics?.totalSubjects ?? 0}</p>
        </div>
        
        <div className="border border-orange-200 p-6 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm text-orange-600 font-semibold uppercase tracking-wider mb-2">Study Streak</h3>
          <p className="text-3xl font-bold text-orange-700">{analytics?.streakCount ?? 0} <span className="text-xl">Days 🔥</span></p>
        </div>
        
        <div className="border border-gray-200 p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-2">Pending Tasks</h3>
          <p className="text-3xl font-bold text-gray-900">{analytics?.pendingTasks ?? 0}</p>
        </div>
        
        <div className="border border-green-200 p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm text-green-700 font-semibold uppercase tracking-wider mb-2">Completion Rate</h3>
          <p className="text-3xl font-bold text-green-800">{analytics?.completionRate ?? 0}%</p>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Recent Activity</h2>
        {progressList && progressList.length > 0 ? (
          <ul className="space-y-4">
            {progressList.slice(0, 5).map((p: any) => (
              <li key={p.id} className="border border-gray-100 p-5 rounded-xl bg-white shadow-sm flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div>
                  {p.type === 'view' ? (
                    <>
                      <p className="font-medium text-gray-900">Viewed file: <span className="font-semibold">{p.noteTitle || 'Untitled'}</span></p>
                      <p className="text-sm text-gray-500 mt-1">Opened file</p>
                    </>
                  ) : p.type === 'progress' ? (
                    <>
                      <p className="font-medium text-gray-900">
                        {p.isCompleted ? 'Completed task' : 'Updated progress'}{p.taskId ? ' (Task)' : ''}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Value recorded: <span className="font-semibold">{p.value ?? 0}%</span></p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-gray-900">{p.title || 'Activity'}</p>
                      <p className="text-sm text-gray-500 mt-1">{p.type}</p>
                    </>
                  )}
                </div>
                <div className="text-sm text-gray-400 font-medium bg-gray-100 px-3 py-1 rounded-full">
                  {p.updatedAt ? new Date(p.updatedAt || p.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : (p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Unknown')}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="border border-dashed border-gray-300 rounded-xl p-10 text-center bg-gray-50">
            <p className="text-gray-500 font-medium">No recent activity found. Start studying to see your progress here!</p>
          </div>
        )}
      </div>
    </div>
  );
}
