import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/context/QuizContext';
import { CheckCircle2, XCircle, Trophy, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Report() {
  const navigate = useNavigate();
  const { state, getScore, resetQuiz } = useQuiz();
  const { questions, answers, email, startTime, endTime, isSubmitted } = state;

  useEffect(() => {
    if (!isSubmitted || questions.length === 0) {
      navigate('/');
    }
  }, [isSubmitted, questions.length, navigate]);

  if (!isSubmitted || questions.length === 0) {
    return null;
  }

  const score = getScore();
  const percentage = Math.round((score / questions.length) * 100);
  const timeTaken = startTime && endTime 
    ? Math.floor((endTime - startTime) / 1000)
    : null;

  const formatTimeTaken = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleRetakeQuiz = () => {
    resetQuiz();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-3xl space-y-8">
        {/* Score Summary */}
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-primary/10">
              <Trophy className={cn(
                "w-10 h-10",
                percentage >= 70 ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
            <p className="text-muted-foreground">{email}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center items-baseline gap-1">
              <span className="text-6xl font-bold text-primary">{score}</span>
              <span className="text-2xl text-muted-foreground">/ {questions.length}</span>
            </div>
            
            <div className="flex justify-center gap-8 text-sm">
              <div className="text-center">
                <p className="text-3xl font-semibold">{percentage}%</p>
                <p className="text-muted-foreground">Score</p>
              </div>
              {timeTaken && (
                <div className="text-center">
                  <p className="text-3xl font-semibold">{formatTimeTaken(timeTaken)}</p>
                  <p className="text-muted-foreground">Time Taken</p>
                </div>
              )}
            </div>

            <div className={cn(
              "inline-block px-4 py-2 rounded-full text-sm font-medium",
              percentage >= 70 
                ? "bg-green-100 text-green-700" 
                : percentage >= 40 
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            )}>
              {percentage >= 70 ? "Excellent Performance!" : percentage >= 40 ? "Good Effort!" : "Keep Practicing!"}
            </div>
          </CardContent>
          <div className="pb-6 flex justify-center">
            <Button onClick={handleRetakeQuiz}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Take Another Quiz
            </Button>
          </div>
        </Card>

        {/* Question Review */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Question Review</h2>
          
          {questions.map((question, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === question.correct_answer;
            const wasAnswered = userAnswer !== undefined;

            return (
              <Card key={index} className={cn(
                "border-l-4",
                isCorrect 
                  ? "border-l-green-500" 
                  : "border-l-red-500"
              )}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium leading-relaxed">{question.question}</p>
                    </div>
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                    )}
                  </div>

                  <div className="ml-11 space-y-2">
                    <div className={cn(
                      "p-3 rounded-lg text-sm",
                      wasAnswered
                        ? isCorrect
                          ? "bg-green-50 border border-green-200"
                          : "bg-red-50 border border-red-200"
                        : "bg-muted"
                    )}>
                      <span className="font-medium">Your Answer: </span>
                      {wasAnswered ? userAnswer : <span className="italic text-muted-foreground">Not answered</span>}
                    </div>
                    
                    {!isCorrect && (
                      <div className="p-3 rounded-lg text-sm bg-green-50 border border-green-200">
                        <span className="font-medium">Correct Answer: </span>
                        {question.correct_answer}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

     
        <div className="text-center pb-8">
          <Button onClick={handleRetakeQuiz} size="lg">
            <RotateCcw className="w-4 h-4 mr-2" />
            Take Another Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
