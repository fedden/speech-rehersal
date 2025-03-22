'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Client-side only wrapper
function ClientOnly({ children }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return children;
}

function VideoRecorder({ isRecording, onRecordingComplete, recordingUrl: existingUrl }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [currentUrl, setCurrentUrl] = useState(existingUrl);
  const [error, setError] = useState(null);
  const [recordingBlob, setRecordingBlob] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const mediaRecorderRef = useRef(null);

  // Get supported MIME type
  const getSupportedMimeType = () => {
    const types = [
      'video/webm',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=h264',
      'video/mp4'
    ];
    return types.find(type => MediaRecorder.isTypeSupported(type)) || 'video/webm';
  };

  // Initialize recording
  useEffect(() => {
    let mounted = true;

    const initializeRecording = async () => {
      try {
        if (isRecording && !isInitialized) {
          console.log('Initializing recording...');
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              frameRate: { ideal: 30 },
            },
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
            }
          });

          if (!mounted) {
            stream.getTracks().forEach(track => track.stop());
            return;
          }

          streamRef.current = stream;
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play().catch(console.error);
          }

          const mimeType = getSupportedMimeType();
          console.log('Using MIME type:', mimeType);

          // Create a MediaRecorder instance
          mediaRecorderRef.current = new MediaRecorder(stream, {
            mimeType,
            videoBitsPerSecond: 2500000 // 2.5 Mbps
          });

          const chunks = [];

          mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
              console.log('Data chunk available:', event.data.size, 'bytes');
              chunks.push(event.data);
            }
          };

          mediaRecorderRef.current.onstop = () => {
            console.log('MediaRecorder stopped, combining chunks...');
            const blob = new Blob(chunks, { type: mimeType });
            console.log('Final blob size:', blob.size, 'bytes');
            
            // Create object URL and test video playback
            const url = URL.createObjectURL(blob);
            const testVideo = document.createElement('video');
            testVideo.src = url;
            
            testVideo.onloadedmetadata = () => {
              console.log('Video metadata loaded successfully');
              setRecordingBlob(blob);
              setCurrentUrl(url);
              onRecordingComplete(url);
            };

            testVideo.onerror = () => {
              console.error('Error testing video playback');
              URL.revokeObjectURL(url);
              setError('Failed to create playable video');
            };
          };

          // Start recording with 1-second chunks
          mediaRecorderRef.current.start(1000);
          console.log('MediaRecorder started');
          setIsInitialized(true);
        }
      } catch (err) {
        console.error('Failed to initialize recording:', err);
        setError('Failed to initialize recording: ' + err.message);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      }
    };

    initializeRecording();

    return () => {
      mounted = false;
    };
  }, [isRecording, isInitialized, onRecordingComplete]);

  // Handle stopping recording
  useEffect(() => {
    const stopRecording = async () => {
      if (!isRecording && isInitialized && mediaRecorderRef.current?.state === 'recording') {
        console.log('Stopping MediaRecorder...');
        try {
          mediaRecorderRef.current.stop();
          
          // Clean up the stream after stopping
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
              track.stop();
              console.log('Stopped track:', track.kind);
            });
            streamRef.current = null;
          }
          setIsInitialized(false);
        } catch (err) {
          console.error('Error stopping recording:', err);
          setError('Failed to stop recording: ' + err.message);
        }
      }
    };

    stopRecording();
  }, [isRecording, isInitialized]);

  // Handle existing URL updates
  useEffect(() => {
    if (existingUrl) {
      console.log('Setting existing URL:', existingUrl);
      setCurrentUrl(existingUrl);
    }
  }, [existingUrl]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state === 'recording') {
        try {
          mediaRecorderRef.current.stop();
        } catch (err) {
          console.error('Error stopping recorder during cleanup:', err);
        }
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (currentUrl && currentUrl !== existingUrl) {
        URL.revokeObjectURL(currentUrl);
      }
      setIsInitialized(false);
    };
  }, [currentUrl, existingUrl]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <div className="text-red-500 mb-2">Error: {error}</div>
        <button
          onClick={() => setError(null)}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {isRecording && (
        <div className="hidden md:block">
          <div className="absolute top-2 right-2 flex items-center z-10">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-xs text-gray-600">Recording</span>
          </div>
        </div>
      )}
      <div className="max-w-xs mx-auto">
        {isRecording && (
          <div className="hidden md:block">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        )}
        {!isRecording && currentUrl && (
          <div>
            <video
              key={currentUrl}
              src={currentUrl}
              controls
              playsInline
              className="w-full rounded-lg shadow-lg"
              onError={(e) => {
                console.error('Video playback error:', e);
                setError('Error playing back the recording. Try downloading the file.');
              }}
            />
            {recordingBlob && (
              <div className="mt-2 flex flex-col items-center space-y-2">
                <a 
                  href={currentUrl}
                  download={`flashcard-recording-${Date.now()}.webm`}
                  className="text-sm text-blue-500 hover:text-blue-700"
                >
                  Download Recording ({Math.round(recordingBlob.size / 1024 / 1024 * 100) / 100} MB)
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Export wrapped in ClientOnly
export default function VideoRecorderWrapper(props) {
  return (
    <ClientOnly>
      <VideoRecorder {...props} />
    </ClientOnly>
  );
} 