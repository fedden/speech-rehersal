'use client';
import { useState, useEffect } from 'react';
import { flashcards } from './data/flashcards';
import FlashCard from './components/FlashCard';
import VideoRecorder from './components/MediaRecorder';
import SessionComplete from './components/SessionComplete';

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
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState(null);
  const [hasMediaPermissions, setHasMediaPermissions] = useState(false);

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

  const checkMediaPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasMediaPermissions(true);
    } catch (err) {
      console.error('Error checking media permissions:', err);
      setHasMediaPermissions(false);
    }
  };

  const startSession = () => {
    // Clean up any existing recording URL
    if (recordingUrl) {
      URL.revokeObjectURL(recordingUrl);
    }

    // Reset all states to their initial values
    setRecordingUrl(null);
    setCurrentCardIndex(0);
    setStartTime(Date.now());
    setElapsedTime(0);
    setIsFlipped(false);
    setIsRecording(true);
  };

  const resetSession = () => {
    // Clean up any existing recording URL
    if (recordingUrl) {
      URL.revokeObjectURL(recordingUrl);
    }

    // Reset all states to their initial values
    setStartTime(null);
    setCurrentCardIndex(null);
    setElapsedTime(0);
    setIsFlipped(false);
    setIsRecording(false);
    setRecordingUrl(null);
  };

  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else if (currentCardIndex === flashcards.length - 1) {
      console.log('Transitioning to final view...');
      // Stop recording first
      setIsRecording(false);
      // Then transition to finished state after a short delay
      setTimeout(() => {
        setCurrentCardIndex(flashcards.length);
        setStartTime(null);
      }, 500);
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

  const handleRecordingComplete = (url) => {
    console.log('Recording completed, URL:', url);
    console.log('Current state:', {
      isFinished,
      currentCardIndex,
      isRecording
    });
    // Always set the recording URL when we get it
    console.log('Setting recordingUrl:', url);
    setRecordingUrl(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="main-container">
        {currentCardIndex === null ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-8">Speech Practice</h1>
              {!hasMediaPermissions ? (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">
                    This app needs camera and microphone access to record your practice session.
                  </p>
                  <button
                    onClick={checkMediaPermissions}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Allow Camera & Microphone
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={startSession}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Start Session
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : isFinished ? (
          <SessionComplete
            elapsedTime={elapsedTime}
            recordingUrl={recordingUrl}
            onStartNewSession={startSession}
          />
        ) : (
          <>
            <div className="header-section flex justify-between items-center">
              <div className="text-gray-600">
                Card {currentCardIndex + 1} of {flashcards.length}
              </div>
              <div className="text-gray-600">
                Time: {formatTime(elapsedTime)}
              </div>
            </div>

            <div className="content-section flex flex-col md:flex-row gap-4">
              <div className="flex-1 min-h-0">
                <FlashCard 
                  card={flashcards[currentCardIndex]} 
                  isActive={true}
                  isFlipped={isFlipped}
                  onFlip={() => setIsFlipped(!isFlipped)}
                  index={currentCardIndex}
                />
              </div>
              <div className="md:w-64 flex-shrink-0">
                <VideoRecorder 
                  isRecording={isRecording}
                  onRecordingComplete={handleRecordingComplete}
                  recordingUrl={null}
                  showPreview={true}
                />
              </div>
            </div>

            <div className="button-section">
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
          </>
        )}
      </div>
    </div>
  );
} 