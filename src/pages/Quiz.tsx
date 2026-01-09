import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/context/QuizContext';
import { Timer } from '@/components/quiz/Timer';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { QuestionOverview } from '@/components/quiz/QuestionOverview';
import { ProgressBar } from '@/components/quiz/ProgressBar';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const QUIZ_DURATION = 30 * 60; // 30 minutes in seconds

export default function Quiz() {
  const navigate = useNavigate();
  const {
    state,
    selectAnswer,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    submitQuiz,
  } = useQuiz();

  const { questions, answers, visitedQuestions, currentQuestionIndex, startTime, isSubmitted } = state;

  // Redirect if no questions loaded or already submitted
  useEffect(() => {
    if (questions.length === 0) {
      navigate('/');
    }
    if (isSubmitted) {
      navigate('/report');
    }
  }, [questions.length, isSubmitted, navigate]);

  const handleTimeUp = useCallback(() => {
    submitQuiz();
    navigate('/report');
  }, [submitQuiz, navigate]);

  const handleSubmit = () => {
    submitQuiz();
    navigate('/report');
  };

  if (questions.length === 0 || !startTime) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold hidden sm:block">Quiz Challenge</h1>
          <Timer startTime={startTime} duration={QUIZ_DURATION} onTimeUp={handleTimeUp} />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="default" size="sm">
                <Send className="w-4 h-4 mr-2" />
                Submit
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
                <AlertDialogDescription>
                  You have answered {answeredCount} of {questions.length} questions.
                  {answeredCount < questions.length && (
                    <span className="block mt-2 text-warning">
                      Warning: {questions.length - answeredCount} questions are unanswered.
                    </span>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Continue Quiz</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit}>Submit Now</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[1fr_280px] gap-6">
          {/* Question Area */}
          <div className="space-y-6">
            <ProgressBar answered={answeredCount} total={questions.length} />
            
            <QuestionCard
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              question={currentQuestion.question}
              options={currentQuestion.shuffledOptions}
              selectedAnswer={answers[currentQuestionIndex]}
              onSelectAnswer={(answer) => selectAnswer(currentQuestionIndex, answer)}
            />

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevQuestion}
                disabled={isFirstQuestion}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              {isLastQuestion ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>
                      <Send className="w-4 h-4 mr-2" />
                      Submit
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You have answered {answeredCount} of {questions.length} questions.
                        {answeredCount < questions.length && (
                          <span className="block mt-2 text-warning">
                            Warning: {questions.length - answeredCount} questions are unanswered.
                          </span>
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Continue Quiz</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSubmit}>Submit Now</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button onClick={nextQuestion}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar - Question Overview */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <QuestionOverview
              totalQuestions={questions.length}
              currentIndex={currentQuestionIndex}
              visitedQuestions={visitedQuestions}
              answers={answers}
              onSelectQuestion={goToQuestion}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}
