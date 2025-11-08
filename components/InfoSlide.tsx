import React from 'react';
import type { SlideContent } from '../types';

interface InfoSlideProps {
  content: SlideContent;
  onComplete: () => void;
}

const InfoSlide: React.FC<InfoSlideProps> = ({ content, onComplete }) => {
  return (
    <div className="p-8 bg-[var(--color-secondary)]/50 rounded-lg border border-[var(--color-accent)]/30 text-center max-w-3xl mx-auto animate-fade-in">
      <h2 className="text-3xl text-[var(--color-accent)] mb-6" style={{ fontFamily: 'var(--font-display)' }}>{content.title}</h2>
      <div className="text-[var(--color-text)]/90 text-lg space-y-4 mb-8 text-left max-w-2xl mx-auto">
        {content.paragraphs.map((p, index) => (
          <p key={index}>{p}</p>
        ))}
      </div>
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

export default InfoSlide;
