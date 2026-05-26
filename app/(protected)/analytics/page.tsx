"use client";

import { useEffect } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';

export default function AnalyticsPage() {
  const { analytics, isLoading, error, fetchSummary } = useAnalytics();

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  if (isLoading) {
    return (
      <div className="p-8 max-w-6xl mx-auto animate-pulse">
        <h1 className="text-3xl font-bold mb-6 text-gray-300 bg-gray-300 w-64 h-8 rounded"></h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border p-6 rounded-xl bg-gray-100 h-64"></div>
          <div className="border p-6 rounded-xl bg-gray-100 h-64"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg">
          <strong>Error loading analytics:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Detailed Analytics</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Completion Stats Card */}
        <div className="border border-gray-200 dark:border-gray-800 p-8 rounded-2xl bg-white dark:bg-slate-900/50 shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">Completion Stats</h2>
          <div className="space-y-5">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Total Tasks</span>
              <span className="font-bold text-lg text-gray-900 dark:text-gray-100">{analytics?.totalTasks ?? 0}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Completed Tasks</span>
              <span className="font-bold text-lg text-green-600 dark:text-green-400">{analytics?.completedTasks ?? 0}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Pending Tasks</span>
              <span className="font-bold text-lg text-yellow-600 dark:text-yellow-400">{analytics?.pendingTasks ?? 0}</span>
            </div>
            
            <div className="pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-600 dark:text-gray-400">Overall Progress (Tasks-only)</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{analytics?.overallProgress ?? analytics?.completionRate ?? 0}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${analytics?.overallProgress ?? analytics?.completionRate ?? 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Curriculum Progress Card */}
        <div className="border border-gray-200 dark:border-gray-800 p-8 rounded-2xl bg-white dark:bg-slate-900/50 shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">Curriculum Progress</h2>
          <div className="space-y-5">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Total Subjects</span>
              <span className="font-bold text-lg text-gray-900 dark:text-gray-100">{analytics?.totalSubjects ?? 0}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Total Topics</span>
              <span className="font-bold text-lg text-gray-900 dark:text-gray-100">{analytics?.totalTopics ?? 0}</span>
            </div>
            <div className="flex justify-between items-center bg-orange-50 dark:bg-orange-950/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30 mt-6">
              <span className="text-orange-800 dark:text-orange-300 font-bold">Current Study Streak</span>
              <span className="font-bold text-2xl text-orange-600 dark:text-orange-400">{analytics?.streakCount ?? 0} Days 🔥</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chart Placeholder */}
      <div className="border border-dashed border-gray-300 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-slate-900/30 h-80 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
        <svg className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="font-medium text-lg">Detailed Visual Charts Integration</p>
        <p className="text-sm mt-1">Ready to be wired up with Recharts or Chart.js</p>
      </div>
    </div>
  );
}
