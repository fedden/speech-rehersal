'use client';
import MarkdownRenderer from './MarkdownRenderer';

export default function FlashCard({ card, isActive, isFlipped, onFlip, index }) {
  if (!isActive) return null;

  return (
    <div className="h-full">
      <div 
        className="h-full relative cursor-pointer bg-white rounded-xl shadow-lg"
        onClick={onFlip}
      >
        <div className="absolute right-4 top-[-2rem] text-[12rem] font-bold text-gray-100 select-none" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </div>
        
        <div className="h-full flex flex-col p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 relative">
            {card.title}{isFlipped ? ' - Answer' : ''}
          </h2>
          
          <div className="flex-1 overflow-y-auto relative">
            <MarkdownRenderer content={isFlipped ? card.back : card.front} />
          </div>
          
          <p className="text-sm text-gray-400 mt-4 relative">
            Click to flip{isFlipped ? ' back' : ''}
          </p>
        </div>
      </div>
    </div>
  );
} 