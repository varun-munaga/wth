import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { loadData, saveData } from '../utils/storage';
import { ChatMessage } from '../types';
import { generateAIResponse } from '../utils/aiResponses';
import { format } from 'date-fns';

interface ChatProps {
  darkMode: boolean;
}

const Chat: React.FC<ChatProps> = ({ darkMode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  useEffect(() => {
    const data = loadData();
    if (data.chatHistory.length === 0) {
      // Initialize with welcome message
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'ai',
        content: `Hello! I'm your AI sleep coach. I'm here to help you manage sleep anxiety with gentle, evidence-based techniques. How are you feeling about sleep tonight?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      saveData({ chatHistory: [welcomeMessage] });
    } else {
      setMessages(data.chatHistory);
    }
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    
    // Generate AI response
    setTimeout(() => {
      const data = loadData();
      const context = {
        recentEntries: data.sleepEntries.slice(-7),
        commonTriggers: ['Academic Stress', 'Overthinking'], // This would be calculated
        averageAnxiety: 6, // This would be calculated
        improvementTrend: false // This would be calculated
      };
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(content, context),
        timestamp: new Date()
      };
      
      const finalMessages = [...newMessages, aiResponse];
      setMessages(finalMessages);
      setIsLoading(false);
      
      // Save to storage
      saveData({ chatHistory: finalMessages });
      
      // Speak response if audio enabled
      if (audioEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiResponse.content);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
      }
    }, 1000 + Math.random() * 1000); // Random delay for realism
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
    setInputMessage('');
  };
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      let chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        // In a real implementation, we'd process the audio
        // For demo, we'll just show a placeholder
        sendMessage("I recorded a voice message (voice recognition not implemented in demo)");
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
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4`}>
        <div className="container mx-auto max-w-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-purple-600' : 'bg-purple-500'} flex items-center justify-center`}>
                <span className="text-white text-lg">🌙</span>
              </div>
              <div>
                <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  AI Sleep Coach
                </h1>
                <p className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  Online • Private & Secure
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-2 rounded-lg ${
                audioEnabled 
                  ? darkMode ? 'text-purple-400' : 'text-purple-600'
                  : darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="container mx-auto max-w-md space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? darkMode
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-600 text-white'
                    : darkMode
                      ? 'bg-gray-700 text-gray-200'
                      : 'bg-white text-gray-800 border border-gray-200'
                } shadow-sm`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {message.content}
                </p>
                <p className={`text-xs mt-2 opacity-70 ${
                  message.type === 'user' ? 'text-purple-100' : darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {format(message.timestamp, 'h:mm a')}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className={`px-4 py-3 rounded-2xl ${
                darkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'
              } shadow-sm`}>
                <div className="flex space-x-1">
                  <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-400' : 'bg-gray-500'} animate-bounce`}></div>
                  <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-400' : 'bg-gray-500'} animate-bounce delay-100`}></div>
                  <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-400' : 'bg-gray-500'} animate-bounce delay-200`}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t p-4`}>
        <div className="container mx-auto max-w-md">
          <form onSubmit={handleSubmit} className="flex items-end space-x-2">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="How can I help with your sleep anxiety tonight?"
                rows={1}
                className={`w-full p-3 rounded-2xl border resize-none ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
            </div>
            
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-3 rounded-full transition-colors ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className={`p-3 rounded-full transition-colors ${
                !inputMessage.trim() || isLoading
                  ? darkMode
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;