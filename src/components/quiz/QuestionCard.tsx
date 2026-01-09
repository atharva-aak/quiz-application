import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  options: string[];
  selectedAnswer: string | undefined;
  onSelectAnswer: (answer: string) => void;
}

export function QuestionCard({
  questionNumber,
  totalQuestions,
  question,
  options,
  selectedAnswer,
  onSelectAnswer,
}: QuestionCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="text-sm font-medium text-muted-foreground mb-2">
          Question {questionNumber} of {totalQuestions}
        </div>
        <h2 className="text-xl font-semibold leading-relaxed">{question}</h2>
      </CardHeader>
      <CardContent className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectAnswer(option)}
            className={cn(
              'w-full text-left p-4 rounded-lg border-2 transition-all',
              'hover:border-primary hover:bg-primary/5',
              selectedAnswer === option
                ? 'border-primary bg-primary/10 font-medium'
                : 'border-border bg-card'
            )}
          >
            <span className="inline-flex items-center justify-center w-7 h-7 mr-3 rounded-full bg-muted text-sm font-medium">
              {String.fromCharCode(65 + index)}
            </span>
            {option}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
