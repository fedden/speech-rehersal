'use client';
import MarkdownRenderer from './MarkdownRenderer';

export default function FlashCard({ card, isActive, isFlipped, onFlip }) {
  if (!isActive) return null;

  return (
    <div className="h-full">
      <div 
        className="h-full relative cursor-pointer"
        onClick={onFlip}
      >
        {/* Front of card */}
        {!isFlipped ? (
          <div className="h-full p-6 bg-white rounded-xl shadow-lg flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{card.title}</h2>
            <div className="flex-1 overflow-y-auto text-gray-600">
              <MarkdownRenderer content={card.front} />
            </div>
            <p className="text-sm text-gray-400 mt-4">Click to flip</p>
          </div>
        ) : (
          <div className="h-full p-6 bg-white rounded-xl shadow-lg flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{card.title} - Answer</h2>
            <div className="flex-1 overflow-y-auto text-gray-600">
              <MarkdownRenderer content={card.back} />
            </div>
            <p className="text-sm text-gray-400 mt-4">Click to flip back</p>
          </div>
        )}
      </div>
    </div>
  );
} 