import React, { useState, useCallback } from 'react';
import type { QuizQuestion } from '../types';

interface QuizActivityProps {
  questions: QuizQuestion[];
  onComplete: () => void;
}

const QuizActivity: React.FC<QuizActivityProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const handleAnswerSubmit = useCallback(() => {
    if (selectedAnswer === null) return;
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setFeedback({
      message: isCorrect ? 'Correct!' : `Not quite. The correct answer was: ${currentQuestion.correctAnswer}`,
      isCorrect,
    });
  }, [selectedAnswer, currentQuestionIndex, questions]);
  
  const handleNext = useCallback(() => {
    setFeedback(null);
    setSelectedAnswer(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
      setTimeout(onComplete, 2000);
    }
  }, [currentQuestionIndex, questions.length, onComplete]);

  if (quizFinished) {
    return (
        <div className="p-6 bg-[var(--color-secondary)]/50 rounded-lg border border-[var(--color-accent)]/30 text-center">
            <h2 className="text-3xl text-green-400 mb-4" style={{ fontFamily: 'var(--font-display)' }}>Quiz Completed!</h2>
            <p className="text-[var(--color-text)]/90">You have proven your knowledge. Well done!</p>
        </div>
    )
  }

  if (!questions || questions.length === 0) {
     return <div className="text-center p-10"><h2 className="text-2xl text-red-400">Could not load questions.</h2></div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="p-6 bg-[var(--color-secondary)]/50 rounded-lg border border-[var(--color-accent)]/30 animate-fade-in">
      <h2 className="text-3xl text-center text-[var(--color-accent)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>Stage 2: Test of Wits</h2>
      <p className="text-center text-[var(--color-text)]/70 mb-6">Question {currentQuestionIndex + 1} of {questions.length}</p>

      <div className="max-w-2xl mx-auto">
        <p className="text-xl text-center mb-8 text-[var(--color-text)]">{currentQuestion.question}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => {
             const isSelected = selectedAnswer === option;
             const isCorrect = option === currentQuestion.correctAnswer;
             const isIncorrectSelection = isSelected && !feedback?.isCorrect;

             let buttonClass = 'bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/70';
             if (isSelected) buttonClass = 'bg-[var(--color-accent)]/80 text-[var(--color-background)] ring-2 ring-[var(--color-accent)]';
             if (feedback && isCorrect) buttonClass = 'bg-green-600 text-white ring-2 ring-green-400';
             if (feedback && isIncorrectSelection) buttonClass = 'bg-red-600 text-white ring-2 ring-red-400';

            return (
            <button
              key={index}
              onClick={() => !feedback && setSelectedAnswer(option)}
              disabled={!!feedback}
              className={`p-4 rounded-lg text-left transition-all duration-200 w-full disabled:cursor-not-allowed ${buttonClass}`}
            >
              {option}
            </button>
          )})}
        </div>

        {feedback && (
          <div className={`mt-6 text-center p-3 rounded-lg ${feedback.isCorrect ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
            <p className="font-bold">{feedback.message}</p>
          </div>
        )}

        <div className="mt-8 text-center">
            {feedback ? (
                 <button onClick={handleNext} className="bg-[var(--color-accent)] text-[var(--color-background)] font-bold py-2 px-8 rounded-lg text-lg hover:opacity-90" style={{ fontFamily: 'var(--font-display)' }}>
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                 </button>
            ) : (
                <button onClick={handleAnswerSubmit} disabled={!selectedAnswer} className="bg-[var(--color-accent)] text-[var(--color-background)] font-bold py-2 px-8 rounded-lg text-lg hover:opacity-90 disabled:bg-gray-500 disabled:cursor-not-allowed" style={{ fontFamily: 'var(--font-display)' }}>
                    Submit Answer
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default QuizActivity;
