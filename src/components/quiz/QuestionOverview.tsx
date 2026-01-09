import { cn } from '@/lib/utils';

interface QuestionOverviewProps {
  totalQuestions: number;
  currentIndex: number;
  visitedQuestions: Set<number>;
  answers: Record<number, string>;
  onSelectQuestion: (index: number) => void;
}

export function QuestionOverview({
  totalQuestions,
  currentIndex,
  visitedQuestions,
  answers,
  onSelectQuestion,
}: QuestionOverviewProps) {
  return (
    <div className="p-4 bg-card rounded-lg border">
      <h3 className="font-semibold mb-3 text-sm">Question Overview</h3>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, index) => {
          const isVisited = visitedQuestions.has(index);
          const isAnswered = answers[index] !== undefined;
          const isCurrent = currentIndex === index;

          return (
            <button
              key={index}
              onClick={() => onSelectQuestion(index)}
              className={cn(
                'w-10 h-10 rounded-lg font-medium text-sm transition-all',
                'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary',
                isCurrent && 'ring-2 ring-primary',
                isAnswered
                  ? 'bg-primary text-primary-foreground'
                  : isVisited
                  ? 'bg-warning/20 text-warning-foreground border border-warning'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-warning/20 border border-warning" />
          <span>Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-muted" />
          <span>Not visited</span>
        </div>
      </div>
    </div>
  );
}
