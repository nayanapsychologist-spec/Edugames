import React from 'react';

interface PlaceholderStageProps {
  title: string;
  description: string;
  onComplete: () => void;
}

const PlaceholderStage: React.FC<PlaceholderStageProps> = ({ title, description, onComplete }) => {
  return (
    <div className="p-8 bg-[var(--color-secondary)]/50 rounded-lg border border-[var(--color-accent)]/30 text-center max-w-2xl mx-auto">
      <h2 className="text-3xl text-[var(--color-accent)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>{title}</h2>
      <p className="text-[var(--color-text)]/90 mb-8">{description}</p>
      <button
        onClick={onComplete}
        className="bg-[var(--color-accent)] text-[var(--color-background)] font-bold py-2 px-8 rounded-lg text-lg hover:opacity-90 transition-all duration-300"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Continue
      </button>
    </div>
  );
};

export default PlaceholderStage;
