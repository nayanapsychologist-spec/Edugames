import React from 'react';

interface ResultsScreenProps {
  score: number;
  title: string;
  pointName: string;
  onPlayAgain: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, title, pointName, onPlayAgain }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center min-h-[80vh]">
      <div className="bg-[var(--color-secondary)]/50 p-8 rounded-xl shadow-2xl border border-[var(--color-accent)]/30 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>Your Journey is Complete!</h1>
        <p className="text-[var(--color-text)]/70 text-lg mb-6">You have navigated the treacherous currents of this topic.</p>
        
        <div className="bg-[var(--color-background)]/50 p-6 rounded-lg mb-8">
            <p className="text-lg text-[var(--color-accent)]" style={{ fontFamily: 'var(--font-display)' }}>Your Final Title</p>
            <p className="text-4xl font-bold text-[var(--color-accent)]/90 my-2" style={{ fontFamily: 'var(--font-display)' }}>{title}</p>
            <hr className="border-[var(--color-accent)]/20 my-4" />
            <p className="text-lg text-[var(--color-primary)]" style={{ fontFamily: 'var(--font-display)' }}>Total {pointName} Earned</p>
            <p className="text-4xl font-bold text-[var(--color-primary)]/90 mt-2">{score.toLocaleString()}</p>
        </div>

        <button
          onClick={onPlayAgain}
          className="bg-[var(--color-accent)] text-[var(--color-background)] font-bold py-3 px-10 rounded-lg text-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Create New Lesson
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;
