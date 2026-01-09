import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  answered: number;
  total: number;
}

export function ProgressBar({ answered, total }: ProgressBarProps) {
  const percentage = (answered / total) * 100;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Progress</span>
        <span>{answered} of {total} answered</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
