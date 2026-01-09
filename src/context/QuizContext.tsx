import React, { createContext, useContext, useState, useCallback } from 'react';
import { QuizQuestion, QuizState, ApiResponse } from '@/types/quiz';
import { shuffleArray, decodeHtmlEntities } from '@/lib/quiz-utils';

interface QuizContextType {
  state: QuizState;
  setEmail: (email: string) => void;
  fetchQuestions: () => Promise<boolean>;
  selectAnswer: (questionIndex: number, answer: string) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submitQuiz: () => void;
  resetQuiz: () => void;
  getScore: () => number;
}

const initialState: QuizState = {
  email: '',
  questions: [],
  answers: {},
  visitedQuestions: new Set([0]),
  currentQuestionIndex: 0,
  startTime: null,
  endTime: null,
  isSubmitted: false,
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<QuizState>(initialState);

  const setEmail = useCallback((email: string) => {
    setState(prev => ({ ...prev, email }));
  }, []);

  const fetchQuestions = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=15');
      const data: ApiResponse = await response.json();
      
      if (data.response_code !== 0) {
        return false;
      }

      const questions: QuizQuestion[] = data.results.map(q => {
        const allOptions = [q.correct_answer, ...q.incorrect_answers];
        return {
          ...q,
          question: decodeHtmlEntities(q.question),
          correct_answer: decodeHtmlEntities(q.correct_answer),
          incorrect_answers: q.incorrect_answers.map(decodeHtmlEntities),
          shuffledOptions: shuffleArray(allOptions.map(decodeHtmlEntities)),
        };
      });

      setState(prev => ({
        ...prev,
        questions,
        startTime: Date.now(),
        visitedQuestions: new Set([0]),
      }));

      return true;
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      return false;
    }
  }, []);

  const selectAnswer = useCallback((questionIndex: number, answer: string) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionIndex]: answer },
    }));
  }, []);

  const goToQuestion = useCallback((index: number) => {
    setState(prev => {
      const newVisited = new Set(prev.visitedQuestions);
      newVisited.add(index);
      return {
        ...prev,
        currentQuestionIndex: index,
        visitedQuestions: newVisited,
      };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setState(prev => {
      if (prev.currentQuestionIndex >= prev.questions.length - 1) return prev;
      const nextIndex = prev.currentQuestionIndex + 1;
      const newVisited = new Set(prev.visitedQuestions);
      newVisited.add(nextIndex);
      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        visitedQuestions: newVisited,
      };
    });
  }, []);

  const prevQuestion = useCallback(() => {
    setState(prev => {
      if (prev.currentQuestionIndex <= 0) return prev;
      return {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      };
    });
  }, []);

  const submitQuiz = useCallback(() => {
    setState(prev => ({
      ...prev,
      isSubmitted: true,
      endTime: Date.now(),
    }));
  }, []);

  const resetQuiz = useCallback(() => {
    setState(initialState);
  }, []);

  const getScore = useCallback(() => {
    return state.questions.reduce((score, question, index) => {
      return state.answers[index] === question.correct_answer ? score + 1 : score;
    }, 0);
  }, [state.questions, state.answers]);

  return (
    <QuizContext.Provider
      value={{
        state,
        setEmail,
        fetchQuestions,
        selectAnswer,
        goToQuestion,
        nextQuestion,
        prevQuestion,
        submitQuiz,
        resetQuiz,
        getScore,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
