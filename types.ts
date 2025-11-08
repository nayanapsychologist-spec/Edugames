export enum GameStage {
  Welcome,
  InfoSlide,
  Chronology,
  Quiz,
  Scaffolding,
  FastestFinger,
  Results,
}

export interface ChronologyItem {
  id: number;
  text: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Title {
  threshold: number;
  name: string;
}

export interface SlideContent {
  title: string;
  paragraphs: string[];
}
  
export interface FastestFingerConcept {
  id: number;
  name: string;
  keywords: string[];
}

export interface FastestFingerOption {
  conceptId: number;
  keywords: string[];
}

export interface FastestFingerQuestion {
  prompt: string;
  options: FastestFingerOption[];
  correctConceptId: number;
}

export interface Theme {
  pointName: string;
  titles: Title[];
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    display: string;
    body: string;
  };
}

export interface LessonPlan {
  topic: string;
  theme: Theme;
  chronology: { items: ChronologyItem[] };
  quiz: { questions: QuizQuestion[] };
  fastestFinger: { concepts: FastestFingerConcept[] };
  infoSlides: SlideContent[];
}


export type GameFlowStep = 
    | { type: GameStage.Welcome }
    | { type: GameStage.Chronology }
    | { type: GameStage.Quiz }
    | { type: GameStage.Scaffolding }
    | { type: GameStage.FastestFinger }
    | { type: GameStage.Results }
    | { type: GameStage.InfoSlide, content: SlideContent };