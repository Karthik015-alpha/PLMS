"use client";

import { Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StreakCardProps {
  currentStreak: number;
}

export function StreakCard({ currentStreak }: StreakCardProps) {
  const isActive = currentStreak > 0;
  
  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200/50 dark:border-orange-900/50 shadow-sm">
      <CardContent className="p-6 flex items-center gap-6">
        <div className={`p-4 rounded-full ${isActive ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-500' : 'bg-muted text-muted-foreground'}`}>
          <Flame className={`w-8 h-8 ${isActive ? 'animate-pulse' : ''}`} />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
          </h2>
          <p className="text-sm text-muted-foreground font-medium mt-1">
            {isActive 
              ? "You're on fire! Keep up the daily study streak." 
              : "Start studying today to build your streak!"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
