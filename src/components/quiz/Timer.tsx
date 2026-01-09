import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { formatTime } from '@/lib/quiz-utils';
import { cn } from '@/lib/utils';

interface TimerProps {
  startTime: number;
  duration: number; // in seconds
  onTimeUp: () => void;
}

export function Timer({ startTime, duration, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, duration, onTimeUp]);

  const isLowTime = timeLeft <= 300; // 5 minutes warning
  const isCritical = timeLeft <= 60; // 1 minute critical

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-semibold transition-colors',
        isCritical
          ? 'bg-destructive/10 text-destructive animate-pulse'
          : isLowTime
          ? 'bg-warning/10 text-warning'
          : 'bg-muted text-foreground'
      )}
    >
      <Clock className="h-5 w-5" />
      <span>{formatTime(timeLeft)}</span>
    </div>
  );
}
