import React, { useState, useEffect, useCallback } from 'react';
import type { FastestFingerQuestion, FastestFingerConcept } from '../types';

interface FastestFingerActivityProps {
  concepts: FastestFingerConcept[];
  onComplete: () => void;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const FastestFingerActivity: React.FC<FastestFingerActivityProps> = ({ concepts, onComplete }) => {
  const [questions, setQuestions] = useState<FastestFingerQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!concepts || concepts.length < 3) {
      setQuestions([]);
      return;
    };
    
    const allConcepts = [...concepts];
    const shuffledConcepts = shuffleArray(allConcepts);
    const NUM_QUESTIONS = Math.min(4, allConcepts.length);
    const NUM_OPTIONS = 3;

    const generatedQuestions = shuffledConcepts.slice(0, NUM_QUESTIONS).map(correctConcept => {
      const distractors = shuffleArray(
        allConcepts.filter(c => c.id !== correctConcept.id)
      ).slice(0, NUM_OPTIONS - 1);

      const options = shuffleArray([
        { conceptId: correctConcept.id, keywords: correctConcept.keywords },
        ...distractors.map(d => ({ conceptId: d.id, keywords: d.keywords }))
      ]);

      return {
        prompt: correctConcept.name,
        options,
        correctConceptId: correctConcept.id
      };
    });
    setQuestions(generatedQuestions);
    setCurrentIndex(0);
    setSelectedId(null);
    setFeedback(null);
    setIsFinished(false);
  }, [concepts]);

  const handleSelectOption = (conceptId: number) => {
    if (feedback !== null) return;
    setSelectedId(conceptId);
    const isCorrect = conceptId === questions[currentIndex].correctConceptId;
    setFeedback(isCorrect);
  };

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedId(null);
      setFeedback(null);
    } else {
      setIsFinished(true);
      setTimeout(onComplete, 2000);
    }
  }, [currentIndex, questions.length, onComplete]);

  if (!questions.length) {
    return <div className="text-center p-10"><h2 className="text-2xl text-[var(--color-accent)] animate-pulse" style={{fontFamily: 'var(--font-display)'}}>Preparing Final Challenge...</h2></div>;
  }
  
  if (isFinished) {
    return (
        <div className="p-6 bg-[var(--color-secondary)]/50 rounded-lg border border-[var(--color-accent)]/30 text-center">
            <h2 className="text-3xl text-green-400 mb-4" style={{ fontFamily: 'var(--font-display)' }}>Final Challenge Complete!</h2>
            <p className="text-[var(--color-text)]/90">The final results are being calculated...</p>
        </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="p-6 bg-[var(--color-secondary)]/50 rounded-lg border border-[var(--color-accent)]/30 animate-fade-in">
      <h2 className="text-3xl text-center text-[var(--color-accent)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>Final Stage: Fastest Finger First!</h2>
      <p className="text-center text-[var(--color-text)]/70 mb-6">Question {currentIndex + 1} of {questions.length}</p>

      <div className="max-w-3xl mx-auto">
        <p className="text-xl text-center mb-4 text-[var(--color-text)]">
          Which set of keywords belongs to:
        </p>
        <p className="text-3xl text-center mb-8 text-[var(--color-accent)] bg-[var(--color-background)]/50 py-3 rounded-lg" style={{ fontFamily: 'var(--font-display)' }}>
          {currentQuestion.prompt}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentQuestion.options.map((option) => {
             const isSelected = selectedId === option.conceptId;
             const isCorrect = option.conceptId === currentQuestion.correctConceptId;
             const isIncorrectSelection = isSelected && feedback === false;
             
             let buttonClass = 'border-transparent bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/70';
             if (isSelected) buttonClass = 'border-[var(--color-accent)] bg-[var(--color-accent)]/20';
             if (feedback !== null && isCorrect) buttonClass = 'bg-green-800/80 border-green-500';
             if (isIncorrectSelection) buttonClass = 'bg-red-800/80 border-red-500';
            
            return (
            <button
              key={option.conceptId}
              onClick={() => handleSelectOption(option.conceptId)}
              disabled={feedback !== null}
              className={`p-4 rounded-lg text-left transition-all duration-200 w-full disabled:cursor-not-allowed flex flex-col justify-start border-2 ${buttonClass}`}
            >
              <div className="flex flex-wrap gap-2">
                {option.keywords.map(keyword => (
                    <span key={keyword} className="bg-[var(--color-background)]/70 text-[var(--color-text)]/90 text-sm px-2 py-1 rounded">
                        {keyword}
                    </span>
                ))}
              </div>
            </button>
          )})}
        </div>

        {feedback !== null && (
          <div className="mt-8 text-center">
             <button onClick={handleNext} className="bg-[var(--color-accent)] text-[var(--color-background)] font-bold py-2 px-8 rounded-lg text-lg hover:opacity-90" style={{ fontFamily: 'var(--font-display)' }}>
                {currentIndex < questions.length - 1 ? 'Next' : 'Finish'}
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FastestFingerActivity;
