"use client";

import { Task } from '@/types/planner';
import { TaskCard } from './task-card';
import { EmptyPlanner } from './empty-planner';

interface PlannerListProps {
  tasks: Task[];
  filter: 'all' | 'pending';
  isLoading?: boolean;
  onToggleComplete: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

export function PlannerList({ tasks, filter, isLoading, onToggleComplete, onDelete, onEdit }: PlannerListProps) {
  if (isLoading && tasks.length === 0) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted/50 rounded-xl" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return <EmptyPlanner filter={filter} />;
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onEdit={onEdit}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
