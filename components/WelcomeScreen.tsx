import React from 'react';

interface WelcomeScreenProps {
  topic: string;
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ topic, onStart }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center min-h-[80vh]">
      <div className="bg-[var(--color-secondary)]/50 p-8 rounded-xl shadow-2xl border border-[var(--color-accent)]/30 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold text-[var(--color-accent)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>{topic}</h1>
        <p className="text-[var(--color-text)]/90 text-lg mb-8">
          An interactive journey into this topic. Test your knowledge, sequence events, and rise through the ranks to achieve the highest honor!
        </p>
        <button
          onClick={onStart}
          className="bg-[var(--color-accent)] text-[var(--color-background)] font-bold py-3 px-10 rounded-lg text-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
           style={{ fontFamily: 'var(--font-display)' }}
        >
          Begin Your Journey
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
