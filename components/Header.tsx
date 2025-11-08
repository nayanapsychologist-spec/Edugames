import React from 'react';
import CoinIcon from './icons/CoinIcon';
import CrownIcon from './icons/CrownIcon';

interface HeaderProps {
  score: number;
  title: string;
  pointName: string;
}

const Header: React.FC<HeaderProps> = ({ score, title, pointName }) => {
  return (
    <header className="w-full bg-[var(--color-secondary)]/50 border border-[var(--color-accent)]/30 rounded-lg p-4 flex justify-between items-center shadow-lg backdrop-blur-sm" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="flex items-center space-x-3">
        <CrownIcon className="w-8 h-8 text-[var(--color-accent)]" />
        <div>
          <p className="text-sm text-[var(--color-text)]/70">Title</p>
          <p className="text-lg font-bold text-[var(--color-accent)]" style={{ fontFamily: 'var(--font-display)' }}>{title}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <p className="text-sm text-[var(--color-text)]/70">{pointName}</p>
          <p className="text-lg font-bold text-[var(--color-primary)]">{score.toLocaleString()}</p>
        </div>
        <CoinIcon className="w-8 h-8 text-[var(--color-primary)]" />
      </div>
    </header>
  );
};

export default Header;
