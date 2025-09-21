import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  Sparkles,
  Heart,
  Moon,
  RefreshCw
} from 'lucide-react';
import { loadData, saveData } from '../utils/storage';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'typing' | 'normal';
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const aiResponses = {
    greeting: [
      "Hello! I'm here to help you with sleep anxiety. How are you feeling tonight? 🌙",
      "Hi there! I'm your AI sleep companion. What's on your mind about sleep?",
      "Good evening! I noticed you're here - are you having trouble with sleep anxiety?"
    ],
    anxiety: [
      "I understand you're feeling anxious about sleep. Let's try the 4-7-8 breathing technique: breathe in for 4 counts, hold for 7, exhale for 8. This activates your parasympathetic nervous system.",
      "Sleep anxiety is really common - you're not alone in this. When we worry about not sleeping, it creates a cycle. Let's break it with some gentle techniques.",
      "I can hear the worry in your message. Your feelings are completely valid. Many people struggle with sleep anxiety, especially during stressful times."
    ],
    sleep_tips: [
      "Here are some evidence-based tips that help with sleep anxiety: Create a wind-down routine 1 hour before bed, keep your bedroom cool (65-68°F), and avoid screens 30 minutes before sleep.",
      "Progressive muscle relaxation can be really helpful. Start with your toes - tense for 5 seconds, then release. Notice the contrast between tension and relaxation as you work up your body.",
      "Your sleep environment matters a lot. Try blackout curtains, white noise, and keeping your phone in another room. Your brain will thank you!"
    ],
    encouragement: [
      "You're taking such a positive step by tracking your sleep and reaching out for help. That takes courage, and I'm proud of you for prioritizing your wellbeing.",
      "Every small step matters in your sleep journey. Even if last night wasn't perfect, you're learning what works for you.",
      "Remember, good sleep isn't about perfection - it's about progress. You're building healthy habits one night at a time."
    ]
  };

  useEffect(() => {
    const data = loadData();
    const chatHistory = data.chatHistory || [];
    
    if (chatHistory.length === 0) {
      // Add initial greeting
      const greeting: Message = {
        id: Date.now().toString(),
        text: aiResponses.greeting[Math.floor(Math.random() * aiResponses.greeting.length)],
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages([greeting]);
    } else {
      setMessages(chatHistory);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('stressed')) {
      return aiResponses.anxiety[Math.floor(Math.random() * aiResponses.anxiety.length)];
    } else if (lowerMessage.includes('sleep') || lowerMessage.includes('bedtime') || lowerMessage.includes('insomnia')) {
      return aiResponses.sleep_tips[Math.floor(Math.random() * aiResponses.sleep_tips.length)];
    } else if (lowerMessage.includes('help') || lowerMessage.includes('better') || lowerMessage.includes('improve')) {
      return aiResponses.encouragement[Math.floor(Math.random() * aiResponses.encouragement.length)];
    } else {
      return "I hear you. Can you tell me more about what's specifically concerning you about sleep tonight? I'm here to help with any anxiety or worries you might have.";
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputText),
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);

      // Save to localStorage
      const data = loadData();
      data.chatHistory = [...(data.chatHistory || []), userMessage, aiResponse];
      saveData(data);
    }, 1000 + Math.random() * 2000);
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-6 max-w-6xl h-screen flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in-down">
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard" 
              className="p-3 hover:bg-white/20 dark:hover:bg-slate-800/20 rounded-xl transition-all duration-300 hover:scale-110"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">AI Sleep Coach</h1>
                <p className="text-sm text-slate-600 dark:text-slate-300">Always here to help with sleep anxiety</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-sm font-medium">
              🔒 Private & Secure
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/20 flex flex-col overflow-hidden animate-fade-in-up">
          
          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 animate-slide-in ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-2xl px-6 py-4 rounded-2xl shadow-lg animate-bounce-in ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white ml-auto'
                      : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-600'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className={`text-xs mt-2 ${
                      message.sender === 'user' 
                        ? 'text-emerald-100' 
                        : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-start space-x-3 animate-fade-in">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white dark:bg-slate-700 px-6 py-4 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-600">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce animation-delay-200"></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce animation-delay-400"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center space-x-4">
              
              {/* Voice Button */}
              <button
                onClick={startListening}
                disabled={isListening}
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                  isListening
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800/50'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Text Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Share what's on your mind about sleep..."
                  className="w-full px-6 py-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-300 hover:shadow-lg"
                />
                {inputText && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                  </div>
                )}
              </div>

              {/* Send Button */}
              <button
                onClick={sendMessage}
                disabled={!inputText.trim() || isTyping}
                className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-xl transition-all duration-300 hover:scale-110 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-2 mt-4">
              {['I can\'t sleep', 'Anxiety techniques', 'Sleep tips', 'Morning routine'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInputText(suggestion)}
                  className="px-4 py-2 text-sm bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style >{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes bounce-in {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .animate-slide-in {
          animation: slide-in 0.4s ease-out forwards;
        }
        .animate-bounce-in {
          animation: bounce-in 0.3s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  );
};

export default Chat;