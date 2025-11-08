import React, { useState } from 'react';
import type { LessonPlan } from './types';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';

const App: React.FC = () => {
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLessonGenerated = (plan: LessonPlan) => {
    setError(null);
    setLessonPlan(plan);
  };

  const handleReset = () => {
    setLessonPlan(null);
    setError(null);
  };
  
  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        {lessonPlan ? (
          <GameScreen lessonPlan={lessonPlan} onReset={handleReset} />
        ) : (
          <SetupScreen 
            onLessonGenerated={handleLessonGenerated} 
            onError={handleError}
            error={error}
          />
        )}
      </div>
    </div>
  );
};

export default App;
