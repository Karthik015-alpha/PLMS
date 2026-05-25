"use client";

import { useEffect, useState } from 'react';
import { usePlanner } from '@/hooks/use-planner';
import { Task } from '@/types/planner';

export default function PlannerPage() {
  const {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    deleteTask,
    markTaskCompleted,
  } = usePlanner();

  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Fetch tasks on initial load or when the filter changes
  useEffect(() => {
    if (filter === 'pending') {
      fetchTasks('pending');
    } else if (filter === 'completed') {
      fetchTasks('completed');
    } else {
      fetchTasks();
    }
  }, [filter, fetchTasks]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTask({ title });
      setTitle(''); // Clear input after successful creation
    } catch (err) {
      // Error is caught and surfaced by the hook via the `error` state
    }
  };

  const handleToggleComplete = async (task: Task) => {
    if (!task.completed) {
      await markTaskCompleted(task.id);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto font-sans text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Study Planner</h1>

      {/* ERROR STATE */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4 shadow-sm border border-red-200">
          <strong>Error: </strong> {error}
        </div>
      )}

      {/* CREATE TASK FORM */}
      <form onSubmit={handleCreateTask} className="mb-8 flex gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you need to study today?"
          className="flex-1 border border-gray-300 dark:border-gray-800 bg-white dark:bg-slate-900/50 text-gray-900 dark:text-gray-100 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !title.trim()}
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Adding...' : 'Add Task'}
        </button>
      </form>

      {/* FILTER TABS */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
        <button
          className={`px-4 py-2 transition-colors ${filter === 'all' ? 'border-b-2 border-blue-600 font-semibold text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          onClick={() => setFilter('all')}
        >
          All Tasks
        </button>
        <button
          className={`px-4 py-2 transition-colors ${filter === 'pending' ? 'border-b-2 border-blue-600 font-semibold text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 transition-colors ${filter === 'completed' ? 'border-b-2 border-blue-600 font-semibold text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {/* TASKS LIST */}
      <div className="space-y-4">
        {isLoading && tasks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading your study study tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-900/30 p-6 rounded text-center border border-dashed border-gray-300 dark:border-gray-800">
            {filter === 'pending' ? 'No pending tasks right now.' : filter === 'completed' ? 'No completed tasks yet. Keep studying!' : "You haven't added any tasks yet. Let's start studying!"}
          </p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="border border-gray-200 dark:border-gray-800 p-4 rounded-lg flex items-center justify-between bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task)}
                  disabled={task.completed || isLoading}
                  className="w-5 h-5 cursor-pointer disabled:cursor-not-allowed rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <h3 className={`font-medium ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-100'}`}>
                    {task.title}
                  </h3>
                  {task.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{task.description}</p>}
                </div>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                disabled={isLoading}
                className="text-red-500 hover:text-red-700 disabled:opacity-50 text-sm font-medium transition-colors px-3 py-1 rounded hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
