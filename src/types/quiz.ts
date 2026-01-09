export interface QuizQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  shuffledOptions: string[];
}

export interface QuizState {
  email: string;
  questions: QuizQuestion[];
  answers: Record<number, string>;
  visitedQuestions: Set<number>;
  currentQuestionIndex: number;
  startTime: number | null;
  endTime: number | null;
  isSubmitted: boolean;
}

export interface ApiResponse {
  response_code: number;
  results: Omit<QuizQuestion, 'shuffledOptions'>[];
}
