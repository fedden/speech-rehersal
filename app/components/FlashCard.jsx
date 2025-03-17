'use client';
import { useState, useEffect } from 'react';
import MarkdownRenderer from './MarkdownRenderer';

export default function FlashCard({ card, isActive }) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip state whenever card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [card.id]);

  if (!isActive) return null;

  return (
    <div className="h-full flex">
      <div 
        className="w-full cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`h-full relative transform-gpu transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front of card */}
          <div className={`absolute inset-0 p-6 bg-white rounded-xl shadow-lg flex flex-col ${isFlipped ? 'hidden' : 'block'}`}>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{card.title}</h2>
            <div className="flex-1 overflow-y-auto text-gray-600">
              <MarkdownRenderer content={card.front} />
            </div>
            <p className="text-sm text-gray-400 mt-4">Click to flip</p>
          </div>

          {/* Back of card */}
          <div className={`absolute inset-0 p-6 bg-white rounded-xl shadow-lg flex flex-col ${isFlipped ? 'block' : 'hidden'}`}>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{card.title} - Answer</h2>
            <div className="flex-1 overflow-y-auto text-gray-600">
              <MarkdownRenderer content={card.back} />
            </div>
            <p className="text-sm text-gray-400 mt-4">Click to flip back</p>
          </div>
        </div>
      </div>
    </div>
  );
} 