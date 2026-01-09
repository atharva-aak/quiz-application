import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuiz } from '@/context/QuizContext';
import { ClipboardList, Clock, HelpCircle, Loader2 } from 'lucide-react';

export default function Index() {
  const [email, setEmailInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setEmail, fetchQuestions } = useQuiz();
  const navigate = useNavigate();

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleStartQuiz = async () => {
    if (!isValidEmail) return;

    setIsLoading(true);
    setError('');
    setEmail(email);

    const success = await fetchQuestions();
    
    if (success) {
      navigate('/quiz');
    } else {
      setError('Failed to load questions. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <ClipboardList className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to the Quiz</CardTitle>
          <CardDescription>
            Test your knowledge with our trivia challenge
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div className="p-3 bg-muted rounded-lg">
              <HelpCircle className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <span className="font-medium">15</span>
              <p className="text-muted-foreground text-xs">Questions</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <span className="font-medium">30</span>
              <p className="text-muted-foreground text-xs">Minutes</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <ClipboardList className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <span className="font-medium">MCQ</span>
              <p className="text-muted-foreground text-xs">Format</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStartQuiz()}
            />
            {email && !isValidEmail && (
              <p className="text-sm text-destructive">Please enter a valid email address</p>
            )}
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleStartQuiz}
            disabled={!isValidEmail || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading Questions...
              </>
            ) : (
              'Start Quiz'
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By starting the quiz, you agree to complete it in one session.
            The timer will begin immediately.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
