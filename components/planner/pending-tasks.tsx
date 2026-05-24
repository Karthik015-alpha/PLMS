"use client";

import { Task } from '@/types/planner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle } from 'lucide-react';

interface PendingTasksProps {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  isLoading?: boolean;
}

export function PendingTasks({ tasks, onToggleComplete, isLoading }: PendingTasksProps) {
  const pendingTasks = tasks.filter(t => !t.completed).slice(0, 5); // Show up to 5 pending

  return (
    <Card className="bg-card shadow-sm border-muted h-full">
      <CardHeader className="pb-3 border-b border-muted/50 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold">Pending Tasks</CardTitle>
        <Badge variant="secondary" className="font-semibold rounded-full px-2.5">
          {pendingTasks.length}
        </Badge>
      </CardHeader>
      
      <CardContent className="p-0">
        {isLoading && pendingTasks.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground animate-pulse">
            Loading tasks...
          </div>
        ) : pendingTasks.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground text-sm">All caught up! No pending tasks.</p>
          </div>
        ) : (
          <div className="divide-y divide-muted/50">
            {pendingTasks.map((task) => (
              <div key={task.id} className="p-4 flex items-start gap-3 hover:bg-muted/30 transition-colors">
                <button
                  onClick={() => onToggleComplete(task)}
                  disabled={isLoading}
                  className="mt-0.5 flex-shrink-0 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                >
                  <Circle className="w-5 h-5" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                  {task.dueDate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Due: {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
