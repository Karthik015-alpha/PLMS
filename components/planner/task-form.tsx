"use client";

import { useState } from 'react';
import { CreateTaskPayload } from '@/features/planner/planner.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (data: CreateTaskPayload) => Promise<void>;
  isLoading?: boolean;
}

export function TaskForm({ onSubmit, isLoading }: TaskFormProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onSubmit({ title: title.trim() });
    setTitle('');
  };

  return (
    <Card className="bg-card shadow-sm border-muted">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's on your study agenda today?"
            className="flex-1 text-base placeholder:text-muted-foreground/60 focus-visible:ring-primary/20"
            disabled={isLoading}
            autoFocus
          />
          <Button 
            type="submit" 
            disabled={!title.trim() || isLoading}
            className="w-full sm:w-auto flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
