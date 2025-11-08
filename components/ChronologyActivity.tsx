import React, { useState, useEffect, useCallback } from 'react';
import type { ChronologyItem } from '../types';

interface ChronologyActivityProps {
  items: ChronologyItem[];
  onComplete: () => void;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const ChronologyActivity: React.FC<ChronologyActivityProps> = ({ items: correctOrder, onComplete }) => {
  const [items, setItems] = useState<ChronologyItem[]>([]);
  const [orderedItems, setOrderedItems] = useState<ChronologyItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<ChronologyItem | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setItems(shuffleArray(correctOrder));
    setOrderedItems([]);
    setFeedback(null);
  }, [correctOrder]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: ChronologyItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    setFeedback(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDropOnTimeline = () => {
    if (draggedItem) {
      setItems(prev => prev.filter(i => i.id !== draggedItem.id));
      setOrderedItems(prev => [...prev.filter(i => i.id !== draggedItem.id), draggedItem]);
      setDraggedItem(null);
    }
  };

  const handleDropOnSource = () => {
    if (draggedItem) {
      setOrderedItems(prev => prev.filter(i => i.id !== draggedItem.id));
      setItems(prev => {
        if (prev.some(i => i.id === draggedItem.id)) return prev;
        return [...prev, draggedItem];
      });
      setDraggedItem(null);
    }
  }

  const verifyOrder = useCallback(() => {
    if (orderedItems.length !== correctOrder.length) {
      setFeedback({ message: 'Please place all items on the timeline.', type: 'error' });
      return;
    }

    const firstIncorrectIndex = orderedItems.findIndex((item, index) => item.id !== correctOrder[index].id);

    if (firstIncorrectIndex === -1) {
      setFeedback({ message: 'Excellent! The order is correct. Proceeding...', type: 'success' });
      setTimeout(onComplete, 2000);
    } else {
      setFeedback({ message: 'Not quite right. Incorrect items have been returned.', type: 'error' });
      const correctPrefix = orderedItems.slice(0, firstIncorrectIndex);
      const itemsToReturn = orderedItems.slice(firstIncorrectIndex);
      setOrderedItems(correctPrefix);
      setItems(prevItems => shuffleArray([...prevItems, ...itemsToReturn]));
    }
  }, [orderedItems, correctOrder, onComplete]);

  const handleReset = useCallback(() => {
    setItems(shuffleArray(correctOrder));
    setOrderedItems([]);
    setFeedback(null);
  }, [correctOrder]);

  return (
    <div className="p-6 bg-[var(--color-secondary)]/50 rounded-lg border border-[var(--color-accent)]/30">
      <h2 className="text-3xl text-center text-[var(--color-accent)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>Stage 1: The Timeline</h2>
      <p className="text-center text-[var(--color-text)]/80 mb-6">Drag the events from the pool and drop them onto the timeline in the correct chronological order.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
            className="p-4 bg-[var(--color-background)]/50 rounded-lg min-h-[200px]"
            onDragOver={handleDragOver}
            onDrop={handleDropOnSource}
        >
          <h3 className="font-bold mb-4 text-lg text-center">Event Pool</h3>
          <div className="space-y-2">
            {items.map(item => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                className="p-3 bg-[var(--color-secondary)] rounded-md cursor-grab active:cursor-grabbing transition-colors"
              >
                {item.text}
              </div>
            ))}
            {items.length === 0 && <p className="text-[var(--color-text)]/60 text-center italic mt-4">All items placed.</p>}
          </div>
        </div>
        
        <div 
            className="p-4 bg-[var(--color-background)]/50 rounded-lg min-h-[200px] border-2 border-dashed border-[var(--color-secondary)]"
            onDragOver={handleDragOver}
            onDrop={handleDropOnTimeline}
        >
          <h3 className="font-bold mb-4 text-lg text-center">Timeline</h3>
          <div className="space-y-2">
            {orderedItems.map((item, index) => (
              <div 
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                className="p-3 bg-[var(--color-accent)]/20 flex items-center space-x-3 rounded-md cursor-grab active:cursor-grabbing"
              >
                <span className="font-bold text-[var(--color-accent)]">{index + 1}.</span>
                <span>{item.text}</span>
              </div>
            ))}
            {orderedItems.length === 0 && <p className="text-[var(--color-text)]/60 text-center italic mt-4">Drop events here.</p>}
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center items-center gap-4">
        <button
          onClick={handleReset}
          className="border border-[var(--color-accent)]/80 text-[var(--color-accent)] font-bold py-2 px-8 rounded-lg text-lg hover:bg-[var(--color-accent)]/20 transition-all duration-300"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Reset
        </button>
        <button
          onClick={verifyOrder}
          disabled={feedback?.type === 'success'}
          className="bg-[var(--color-accent)] text-[var(--color-background)] font-bold py-2 px-8 rounded-lg text-lg hover:opacity-90 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Verify Order
        </button>
      </div>

      {feedback && (
        <p className={`mt-4 text-center text-lg ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
          {feedback.message}
        </p>
      )}
    </div>
  );
};

export default ChronologyActivity;
