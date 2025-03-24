'use client';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { affirmations, affirmationGuide } from '../data/affirmations';
import dynamic from 'next/dynamic';

const TinderCard = dynamic(() => import('react-tinder-card'), {
  ssr: false,
  loading: () => (
    <div className="card bg-white h-full w-full p-8 flex flex-col justify-center items-center text-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  ),
});

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function AffirmationsPage() {
  const [currentIndex, setCurrentIndex] = useState(affirmations.length - 1);
  const [cards, setCards] = useState(affirmations);
  const [hasStarted, setHasStarted] = useState(false);
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(affirmations.length)
        .fill(0)
        .map(() => React.createRef()),
    []
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  // Set initial height
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
  }, []);

  const canSwipe = currentIndex >= 0;

  const swiped = (direction, index) => {
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (idx) => {
    console.log(`Card ${idx} left the screen!`);
    // Remove the card from the stack
    setCards((prev) => prev.filter((_, index) => index !== idx));
  };

  const swipe = async (direction = 'left') => {
    if (canSwipe && currentIndex >= 0) {
      try {
        await childRefs[currentIndex].current.swipe(direction);
      } catch (error) {
        console.error('Error swiping:', error);
        // Manual fallback if swipe fails
        updateCurrentIndex(currentIndex - 1);
        setCards((prev) => prev.filter((_, index) => index !== currentIndex));
      }
    }
  };

  const startAgain = () => {
    const shuffledAffirmations = shuffleArray(affirmations);
    setCurrentIndex(shuffledAffirmations.length - 1);
    setCards(shuffledAffirmations);
    setHasStarted(true);
  };

  const remainingCards = currentIndex + 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-lg mx-auto h-full">
        {!hasStarted ? (
          <div className="h-[calc(100vh-8rem)] overflow-y-auto pb-20">
            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{affirmationGuide.title}</h2>
              <ul className="space-y-4">
                {affirmationGuide.steps.map((step, index) => (
                  typeof step === 'string' ? (
                    <li key={index} className="text-gray-700">• {step}</li>
                  ) : (
                    <li key={index} className="text-gray-700">
                      <p className="font-medium">• {step.title}</p>
                      <ul className="ml-6 mt-2 space-y-2">
                        {step.items.map((item, i) => (
                          <li key={i}>◦ {item}</li>
                        ))}
                      </ul>
                    </li>
                  )
                ))}
              </ul>
              <p className="text-gray-700 italic mt-6">{affirmationGuide.conclusion}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-8">
              <div className="text-gray-600">
                {remainingCards} card{remainingCards !== 1 ? 's' : ''} remaining
              </div>
            </div>

            <div className="relative h-[calc(100vh-16rem)] md:h-[600px]">
              <div className="absolute inset-0">
                {cards.map((affirmation, index) => (
                  <TinderCard
                    ref={childRefs[index]}
                    key={affirmation.id}
                    onSwipe={(dir) => swiped(dir, index)}
                    onCardLeftScreen={() => outOfFrame(index)}
                    className="swipe absolute left-0 right-0 h-full"

                  >
                    <div className={`card bg-white h-full w-full p-8 flex flex-col justify-center items-center text-center ${index === currentIndex ? 'top-card' : ''}`}>
                      <p className="text-xl md:text-2xl font-medium max-w-md">
                        {affirmation.text}
                      </p>
                    </div>
                  </TinderCard>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="button-section fixed bottom-0 left-0 right-0 p-4 flex justify-center space-x-4 bg-white/80 backdrop-blur-sm">
          {!hasStarted ? (
            <button
              onClick={startAgain}
              className="px-6 py-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Start Affirmations
            </button>
          ) : remainingCards > 0 ? (
            <button
              className="px-6 py-3 rounded-full bg-blue-500 text-white disabled:opacity-50"
              onClick={swipe}
              disabled={!canSwipe}
            >
              Next
            </button>
          ) : (
            <button
              onClick={startAgain}
              className="px-6 py-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Start Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 