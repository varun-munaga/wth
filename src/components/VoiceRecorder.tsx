import React, { useState, useRef } from 'react';
import { Mic, MicOff, Play, Pause } from 'lucide-react';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  darkMode?: boolean;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete, darkMode = false }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setHasRecording(true);
        onRecordingComplete(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const togglePlayback = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const resetRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl('');
    setHasRecording(false);
    setIsPlaying(false);
  };
  
  return (
    <div className="space-y-4">
      <label className={`block text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        Voice Note (Optional)
      </label>
      
      <div className={`p-6 rounded-xl border-2 border-dashed ${
        darkMode ? 'border-gray-600 bg-gray-800/50' : 'border-gray-300 bg-gray-50'
      }`}>
        {!hasRecording ? (
          <div className="text-center">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`mx-auto flex items-center justify-center w-16 h-16 rounded-full transition-all duration-200 ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : darkMode
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            <p className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {isRecording ? 'Recording... Tap to stop' : 'Tap to start recording'}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={togglePlayback}
                className={`flex items-center justify-center w-12 h-12 rounded-full ${
                  darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-600 hover:bg-purple-700'
                } text-white transition-colors`}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {isPlaying ? 'Playing...' : 'Voice note recorded'}
              </span>
            </div>
            <button
              onClick={resetRecording}
              className={`text-sm ${
                darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'
              } transition-colors`}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;