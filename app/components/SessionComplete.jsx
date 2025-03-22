'use client';
import VideoRecorder from './MediaRecorder';

export default function SessionComplete({ elapsedTime, recordingUrl, onStartNewSession }) {
  const formatTime = (seconds) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds === 0 
      ? `${minutes}m` 
      : `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col items-center justify-start p-4 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Session Complete!</h2>
          <p className="text-xl text-gray-600 mb-8">Final Time: {formatTime(elapsedTime)}</p>
        </div>
        
        {recordingUrl && (
          <div className="w-full max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-4">Review Your Session</h3>
            <VideoRecorder 
              isRecording={false}
              onRecordingComplete={() => {}}
              recordingUrl={recordingUrl}
              showPreview={true}
            />
          </div>
        )}

        <button
          onClick={onStartNewSession}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors mt-4"
        >
          Start New Session
        </button>
      </div>
    </div>
  );
} 