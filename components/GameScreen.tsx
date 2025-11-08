import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { STAGE_REWARD } from '../constants';
import { GameStage, type Title, type LessonPlan, type GameFlowStep } from '../types';
import Header from './Header';
import WelcomeScreen from './WelcomeScreen';
import ChronologyActivity from './ChronologyActivity';
import QuizActivity from './QuizActivity';
import PlaceholderStage from './PlaceholderStage';
import ResultsScreen from './ResultsScreen';
import InfoSlide from './InfoSlide';
import FastestFingerActivity from './FastestFingerActivity';

interface GameScreenProps {
  lessonPlan: LessonPlan;
  onReset: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ lessonPlan, onReset }) => {
  const [flowIndex, setFlowIndex] = useState<number>(0);
  const [score, setScore] =useState<number>(0);

  // Dynamically inject fonts and CSS variables for theming
  useEffect(() => {
    const { fonts, colorScheme } = lessonPlan.theme;

    // Remove existing font links to prevent duplicates on reset
    const existingLinks = document.querySelectorAll('link[data-dynamic-font]');
    existingLinks.forEach(link => link.remove());

    // Add new font link
    const fontLink = document.createElement('link');
    fontLink.href = `https://fonts.googleapis.com/css2?family=${fonts.display.replace(/ /g, '+')}:wght@400;700&family=${fonts.body.replace(/ /g, '+')}:wght@400;500;700&display=swap`;
    fontLink.rel = 'stylesheet';
    fontLink.setAttribute('data-dynamic-font', 'true');
    document.head.appendChild(fontLink);
    
    // Apply CSS variables
    const root = document.documentElement;
    root.style.setProperty('--color-primary', colorScheme.primary);
    root.style.setProperty('--color-secondary', colorScheme.secondary);
    root.style.setProperty('--color-accent', colorScheme.accent);
    root.style.setProperty('--color-background', colorScheme.background);
    root.style.setProperty('--color-text', colorScheme.text);
    root.style.setProperty('--font-display', `'${fonts.display}', serif`);
    root.style.setProperty('--font-body', `'${fonts.body}', sans-serif`);

    document.body.style.backgroundColor = 'var(--color-background)';
    document.body.style.color = 'var(--color-text)';
    document.body.style.fontFamily = 'var(--font-body)';

  }, [lessonPlan.theme]);
  
  const GAME_FLOW = useMemo<GameFlowStep[]>(() => [
    { type: GameStage.Welcome },
    { type: GameStage.InfoSlide, content: lessonPlan.infoSlides[0] },
    { type: GameStage.Chronology },
    { type: GameStage.InfoSlide, content: lessonPlan.infoSlides[1] },
    { type: GameStage.Quiz },
    { type: GameStage.FastestFinger },
    { type: GameStage.Results }
  ], [lessonPlan.infoSlides]);

  const currentStep = useMemo(() => GAME_FLOW[flowIndex], [flowIndex, GAME_FLOW]);

  const currentTitle = useMemo<string>(() => {
    let activeTitle: Title = lessonPlan.theme.titles[0];
    for (const title of lessonPlan.theme.titles) {
      if (score >= title.threshold) {
        activeTitle = title;
      }
    }
    return activeTitle.name;
  }, [score, lessonPlan.theme.titles]);

  const handleNextStep = useCallback(() => {
    if (flowIndex < GAME_FLOW.length - 1) {
      setFlowIndex(prevIndex => prevIndex + 1);
    }
  }, [flowIndex, GAME_FLOW.length]);

  const handleActivityComplete = useCallback(() => {
    setScore(prevScore => prevScore + STAGE_REWARD);
    handleNextStep();
  }, [handleNextStep]);

  const renderStage = () => {
    if (!currentStep) return null;

    switch (currentStep.type) {
      case GameStage.Welcome:
        return <WelcomeScreen topic={lessonPlan.topic} onStart={handleNextStep} />;
      case GameStage.InfoSlide:
        return <InfoSlide content={currentStep.content} onComplete={handleNextStep} />;
      case GameStage.Chronology:
        return <ChronologyActivity items={lessonPlan.chronology.items} onComplete={handleActivityComplete} />;
      case GameStage.Quiz:
        return <QuizActivity questions={lessonPlan.quiz.questions} onComplete={handleActivityComplete} />;
      case GameStage.FastestFinger:
        return <FastestFingerActivity concepts={lessonPlan.fastestFinger.concepts} onComplete={handleActivityComplete} />;
      case GameStage.Results:
        return <ResultsScreen score={score} title={currentTitle} pointName={lessonPlan.theme.pointName} onPlayAgain={onReset} />;
      default:
        return <WelcomeScreen topic={lessonPlan.topic} onStart={handleNextStep} />;
    }
  };

  return (
    <>
      {currentStep.type !== GameStage.Welcome && currentStep.type !== GameStage.Results && (
          <Header score={score} title={currentTitle} pointName={lessonPlan.theme.pointName} />
      )}
      <main className="mt-8">
        {renderStage()}
      </main>
    </>
  );
};

export default GameScreen;
