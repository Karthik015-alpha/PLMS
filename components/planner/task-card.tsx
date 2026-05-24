"use client";

import { Task } from '@/types/planner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Clock, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  isLoading?: boolean;
}

export function TaskCard({ task, onToggleComplete, onDelete, isLoading }: TaskCardProps) {
  const isCompleted = task.completed;

  // Format date if present
  const dueDateStr = task.dueDate 
    ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : null;

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${isCompleted ? 'bg-muted/50 border-muted' : 'bg-card'}`}>
      <CardContent className="p-4 flex items-start gap-4">
        {/* Checkbox / Status Toggle */}
        <button
          onClick={() => onToggleComplete(task)}
          disabled={isLoading}
          className={`mt-1 flex-shrink-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isCompleted ? 'text-primary' : 'text-muted-foreground hover:text-primary'
          }`}
        >
          {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-semibold text-base truncate ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {task.title}
            </h3>
            
            {dueDateStr && (
              <Badge variant={isCompleted ? 'secondary' : 'outline'} className="flex-shrink-0 flex items-center gap-1 font-normal text-xs">
                <Clock className="w-3 h-3" />
                {dueDateStr}
              </Badge>
            )}
          </div>
          
          {task.description && (
            <p className={`mt-1 text-sm line-clamp-2 ${isCompleted ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
              {task.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
            disabled={isLoading}
            className="text-destructive/70 hover:text-destructive hover:bg-destructive/10"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
