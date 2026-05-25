'use client';

interface ActivityItem {
  id: string;
  type: string;
  title?: string;
  noteTitle?: string;
  taskId?: string;
  value?: number;
  isCompleted?: boolean;
  updatedAt?: string;
  createdAt?: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityContent = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'view':
        return {
          title: `Viewed file: ${activity.noteTitle || 'Untitled'}`,
          description: 'Opened file',
        };
      case 'task_created':
        return {
          title: `Created task: ${activity.noteTitle || activity.title || 'Untitled'}`,
          description: 'Added to planner',
        };
      case 'task_completed':
        return {
          title: `Completed task: ${activity.noteTitle || activity.title || 'Untitled'}`,
          description: 'Marked as done',
        };
      case 'progress':
        return {
          title: `${activity.isCompleted ? 'Completed task' : 'Updated progress'}${activity.taskId ? ' (Task)' : ''}`,
          description: `Value recorded: ${activity.value ?? 0}%`,
        };
      default:
        return {
          title: activity.title || 'Activity',
          description: activity.type,
        };
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  if (activities.length === 0) {
    return (
      <div className="border border-dashed border-gray-300 dark:border-gray-800 rounded-xl p-10 text-center bg-gray-50 dark:bg-slate-900/30">
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          No recent activity found. Start studying to see your progress here!
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {activities.map((activity) => {
        const content = getActivityContent(activity);
        return (
          <li
            key={activity.id}
            className="border border-gray-100 dark:border-gray-800 p-5 rounded-xl bg-white dark:bg-slate-900/50 shadow-sm flex justify-between items-center hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{content.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{content.description}</p>
            </div>
            <div className="text-sm text-gray-400 dark:text-gray-300 font-medium bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              {formatDate(activity.updatedAt || activity.createdAt)}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
