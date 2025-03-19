'use client';
import MarkdownRenderer from './MarkdownRenderer';

export default function FlashCard({ card, isActive, isFlipped, onFlip, index }) {
  if (!isActive) return null;

  return (
    <div className="h-full">
      <div 
        className="h-full relative cursor-pointer"
        onClick={onFlip}
      >
        {/* Front of card */}
        {!isFlipped ? (
          <div className="h-full p-6 bg-white rounded-xl shadow-lg flex flex-col relative overflow-hidden">
            <div className="absolute right-4 top-[-2rem] text-[12rem] font-bold text-gray-100 select-none" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 relative">{card.title}</h2>
            <div className="flex-1 overflow-y-auto text-gray-600 relative">
              <MarkdownRenderer content={card.front} />
            </div>
            <p className="text-sm text-gray-400 mt-4 relative">Click to flip</p>
          </div>
        ) : (
          <div className="h-full p-6 bg-white rounded-xl shadow-lg flex flex-col relative overflow-hidden">
            <div className="absolute right-4 top-[-2rem] text-[12rem] font-bold text-gray-100 select-none" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 relative">{card.title} - Answer</h2>
            <div className="flex-1 overflow-y-auto text-gray-600 relative">
              <MarkdownRenderer content={card.back} />
            </div>
            <p className="text-sm text-gray-400 mt-4 relative">Click to flip back</p>
          </div>
        )}
      </div>
    </div>
  );
} 