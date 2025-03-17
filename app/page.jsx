'use client';
import { useState, useEffect } from 'react';
import { flashcards } from './data/flashcards';
import FlashCard from './components/FlashCard';

function formatTime(seconds) {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds === 0 
    ? `${minutes}m` 
    : `${minutes}m ${remainingSeconds}s`;
}

export default function Home() {
  const [currentCardIndex, setCurrentCardIndex] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (startTime) {
      const timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (currentCardIndex === null) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
            setIsFlipped(false);
          } else if (currentCardIndex === 0) {
            resetSession();
          }
          break;
        case 'ArrowRight':
        case 'Enter':
          if (currentCardIndex < flashcards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setIsFlipped(false);
          } else if (currentCardIndex === flashcards.length - 1) {
            setCurrentCardIndex(flashcards.length);
            setStartTime(null);
          }
          break;
        case ' ': // Space key
          e.preventDefault(); // Prevent page scrolling
          if (!isFinished) {
            setIsFlipped(!isFlipped);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentCardIndex, isFlipped]);

  const startSession = () => {
    setStartTime(Date.now());
    setCurrentCardIndex(0);
    setElapsedTime(0);
    setIsFlipped(false);
  };

  const resetSession = () => {
    setStartTime(null);
    setCurrentCardIndex(null);
    setElapsedTime(0);
    setIsFlipped(false);
  };

  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else if (currentCardIndex === flashcards.length - 1) {
      setCurrentCardIndex(flashcards.length);
      setStartTime(null);
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    } else if (currentCardIndex === 0) {
      resetSession();
    }
  };

  const isFinished = currentCardIndex === flashcards.length;

  return (
    <div className="flashcard-container">
      <div className="card-section">
        <div className="card">
          {currentCardIndex === null ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-8">Speech Practice</h1>
                <button
                  onClick={startSession}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Start Session
                </button>
              </div>
            </div>
          ) : isFinished ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Session Complete!</h2>
                <p className="text-xl text-gray-600 mb-8">Final Time: {formatTime(elapsedTime)}</p>
                <button
                  onClick={startSession}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Start New Session
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="h-12 flex justify-between items-center mb-4">
                <div className="text-gray-600">
                  Card {currentCardIndex + 1} of {flashcards.length}
                </div>
                <div className="text-gray-600">
                  Time: {formatTime(elapsedTime)}
                </div>
              </div>

              <div className="h-[calc(100vh-9rem)]">
                <FlashCard 
                  card={flashcards[currentCardIndex]} 
                  isActive={true}
                  isFlipped={isFlipped}
                  onFlip={() => setIsFlipped(!isFlipped)}
                />
              </div>

              <div className="h-16 mt-4">
                <div className="flex justify-between items-center">
                  <button
                    onClick={previousCard}
                    className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {currentCardIndex === 0 ? 'Reset' : 'Previous'}
                  </button>
                  <div className="keyboard-help text-sm text-gray-500">
                    Use ←/→ to navigate • Space to flip • Enter for next
                  </div>
                  <button
                    onClick={nextCard}
                    className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {currentCardIndex === flashcards.length - 1 ? 'Complete' : 'Next'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 