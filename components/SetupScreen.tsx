import React, { useState } from 'react';
import type { LessonPlan } from '../types';
import { generateLessonPlan } from '../services/geminiService';

interface SetupScreenProps {
  onLessonGenerated: (plan: LessonPlan) => void;
  onError: (error: string) => void;
  error: string | null;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onLessonGenerated, onError, error }) => {
  const [topic, setTopic] = useState('The Decline of the Mughal Empire');
  const [content, setContent] = useState(
    `The Mughal Empire saw a rapid decline after the death of Aurangzeb. The later Mughals like Bahadur Shah I, Farrukhsiyar, and Muhammad Shah were weak rulers. Foreign invaders like Nadir Shah from Persia (1739) and Ahmad Shah Abdali from Afghanistan repeatedly weakened the empire. The Battle of Buxar (1764) was a decisive defeat for Shah Alam II, making the British East India Company the real power. The nobility became too powerful, creating factions and pursuing their own interests, which led to the collapse of the administrative Mansabdari system. The final emperor, Bahadur Shah Zafar, was a figurehead in the Revolt of 1857 and was exiled, ending the Mughal dynasty.`
  );
  const [gradeLevel, setGradeLevel] = useState('8th Grade');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !content.trim() || !gradeLevel.trim()) {
      onError("All fields must be filled out.");
      return;
    }
    setIsLoading(true);
    try {
      const plan = await generateLessonPlan(topic, content, gradeLevel);
      onLessonGenerated(plan);
    } catch (err: any) {
      onError(err.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-3xl bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
        <h1 className="text-4xl text-center font-bold text-slate-100 mb-2" style={{fontFamily: 'sans-serif'}}>Lesson Generator</h1>
        <p className="text-slate-400 text-center mb-8">Enter your lesson content to generate a dynamic, interactive game.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-slate-300 mb-2">Topic</label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., The French Revolution"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-slate-300 mb-2">Lesson Content / Notes</label>
            <textarea
              id="content"
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Paste your key concepts, events, and figures here..."
            />
          </div>
          <div>
            <label htmlFor="gradeLevel" className="block text-sm font-medium text-slate-300 mb-2">Grade Level</label>
            <input
              type="text"
              id="gradeLevel"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 10th Grade"
            />
          </div>
          
          {error && <p className="text-red-400 text-center">{error}</p>}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-3 px-10 rounded-lg text-xl hover:bg-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:bg-slate-600 disabled:cursor-wait"
            >
              {isLoading ? 'Generating Your Lesson...' : 'Generate Lesson'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetupScreen;
