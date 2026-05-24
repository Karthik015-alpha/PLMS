"use client";

import { ClipboardList } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyPlannerProps {
  filter: 'all' | 'pending';
}

export function EmptyPlanner({ filter }: EmptyPlannerProps) {
  return (
    <Card className="border-dashed border-2 bg-transparent shadow-none">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <ClipboardList className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {filter === 'pending' ? 'All Caught Up!' : 'No Tasks Yet'}
        </h3>
        <p className="text-muted-foreground max-w-sm">
          {filter === 'pending' 
            ? "You don't have any pending tasks. Take a break or add something new to study." 
            : "Your study planner is empty. Add a new task above to get started!"}
        </p>
      </CardContent>
    </Card>
  );
}
