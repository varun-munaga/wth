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
  RefreshCw,
  Zap,
  Shield,
  Coffee,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { loadData, saveData } from '../utils/storage';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'typing' | 'normal';
}

interface ChatData {
  chatHistory?: Message[];
  user?: {
    name: string;
  };
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const aiResponses = {
    greeting: [
      "Hello! I'm here to help you with sleep anxiety. How are you feeling tonight? 🌙",
      "Hi there! I'm your AI sleep companion. What's on your mind about sleep?",
      "Good evening! I noticed you're here - are you having trouble with sleep anxiety?",
      "Welcome! I'm glad you're taking steps to improve your sleep. How can I support you today?"
    ],
    anxiety: [
      "I understand you're feeling anxious about sleep. Let's try the 4-7-8 breathing technique: breathe in for 4 counts, hold for 7, exhale for 8. This activates your parasympathetic nervous system and can help calm your mind.",
      "Sleep anxiety is really common - you're not alone in this. When we worry about not sleeping, it creates a cycle. Let's break it with some gentle techniques that have helped many others.",
      "I can hear the worry in your message. Your feelings are completely valid. Many people struggle with sleep anxiety, especially during stressful times. Let's work through this together.",
      "Anxiety about sleep often makes sleep more elusive. It's like trying not to think about a pink elephant! Let's redirect that worried energy into some calming practices."
    ],
    sleep_tips: [
      "Here are some evidence-based tips that help with sleep anxiety: Create a wind-down routine 1 hour before bed, keep your bedroom cool (65-68°F), and avoid screens 30 minutes before sleep. Which of these sounds most doable for you?",
      "Progressive muscle relaxation can be really helpful. Start with your toes - tense for 5 seconds, then release. Notice the contrast between tension and relaxation as you work up your body. This helps your mind recognize what relaxation feels like.",
      "Your sleep environment matters a lot. Try blackout curtains, white noise, and keeping your phone in another room. Your brain will thank you! Sometimes small changes make the biggest difference.",
      "The '3-2-1 rule' works well: 3 hours before bed, no more food; 2 hours before, no more work; 1 hour before, no more screens. This gives your brain time to wind down naturally."
    ],
    encouragement: [
      "You're taking such a positive step by tracking your sleep and reaching out for help. That takes courage, and I'm proud of you for prioritizing your wellbeing. Every small step matters.",
      "Every small step matters in your sleep journey. Even if last night wasn't perfect, you're learning what works for you. Progress isn't always linear, and that's perfectly okay.",
      "Remember, good sleep isn't about perfection - it's about progress. You're building healthy habits one night at a time. Be gentle with yourself through this process.",
      "I see how much effort you're putting into improving your sleep. That commitment to your health is inspiring. Keep going - you're making more progress than you realize."
    ],
    patterns: [
      "I notice you mentioned [trigger]. This is a common pattern I see. When [specific situation] happens, our minds often go into overdrive. Let's create a plan for managing this specific trigger.",
      "Based on what you've shared, it seems like [pattern] might be affecting your sleep. Many people experience this. Here's what tends to help in situations like yours...",
      "You're showing great self-awareness by noticing these patterns. That's actually a huge step forward in managing sleep anxiety."
    ]
  };

  const quickSuggestions = [
    "I can't fall asleep tonight",
    "My mind is racing",
    "I'm worried about tomorrow",
    "Help me relax",
    "What if I don't get enough sleep?",
    "I wake up anxious",
    "Sunday night anxiety",
    "Morning routine tips"
  ];

  useEffect(() => {
    const initializeChat = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));

      const data: ChatData = loadData();
      const chatHistory = data.chatHistory || [];
      
      if (chatHistory.length === 0) {
        // Add personalized greeting
        const greeting: Message = {
          id: Date.now().toString(),
          text: data.user?.name 
            ? `Hello ${data.user.name}! ${aiResponses.greeting[Math.floor(Math.random() * aiResponses.greeting.length)]}` 
            : aiResponses.greeting[Math.floor(Math.random() * aiResponses.greeting.length)],
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages([greeting]);
      } else {
        setMessages(chatHistory);
      }
      
      setSuggestions(quickSuggestions.slice(0, 4));
      setIsLoading(false);
    };

    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Pattern matching for more contextual responses
    if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('stressed') || lowerMessage.includes('panic')) {
      return aiResponses.anxiety[Math.floor(Math.random() * aiResponses.anxiety.length)];
    } else if (lowerMessage.includes('sleep') || lowerMessage.includes('bedtime') || lowerMessage.includes('insomnia') || lowerMessage.includes('tired')) {
      return aiResponses.sleep_tips[Math.floor(Math.random() * aiResponses.sleep_tips.length)];
    } else if (lowerMessage.includes('help') || lowerMessage.includes('better') || lowerMessage.includes('improve') || lowerMessage.includes('thanks') || lowerMessage.includes('good')) {
      return aiResponses.encouragement[Math.floor(Math.random() * aiResponses.encouragement.length)];
    } else if (lowerMessage.includes('racing') || lowerMessage.includes('overthinking') || lowerMessage.includes('mind')) {
      return "When your mind is racing, it's like having too many browser tabs open! Let's close some of those mental tabs with a grounding exercise: Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. This helps bring your attention to the present moment.";
    } else if (lowerMessage.includes('sunday') || lowerMessage.includes('tomorrow') || lowerMessage.includes('monday')) {
      return "Sunday night anxiety is so common it has a name - 'Sunday Scaries'! You're definitely not alone. Try preparing for Monday evening instead of Sunday night. Lay out clothes, prep lunch, write tomorrow's top 3 priorities. This gives you a sense of control and readiness.";
    } else if (lowerMessage.includes('wake up') || lowerMessage.includes('morning') || lowerMessage.includes('early')) {
      return "Waking up anxious can set the tone for the whole day. Try this: before getting up, take 5 deep breaths and think of one thing you're looking forward to today - even if it's small, like your morning coffee. Your brain needs a positive anchor to start the day.";
    } else {
      return "I hear you. Can you tell me more about what's specifically concerning you about sleep tonight? I'm here to help with any anxiety or worries you might have. Sometimes just talking through what's on your mind can be the first step to feeling better.";
    }
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputText.trim();
    if (!textToSend) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Hide suggestions after first user message
    if (suggestions.length > 0) {
      setSuggestions([]);
    }

    // Simulate AI thinking time with more realistic delay
    const thinkingTime = 1200 + Math.random() * 2000;
    
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(textToSend),
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);

      // Save to localStorage
      const data = loadData();
      data.chatHistory = [...(data.chatHistory || []), userMessage, aiResponse];
      saveData(data);
    }, thinkingTime);
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading your AI companion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-6 max-w-6xl h-screen flex flex-col">
        
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in-down">
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard" 
              className="p-3 hover:bg-white/20 dark:hover:bg-slate-800/20 rounded-xl transition-all duration-300 hover:scale-110 group"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-glow">
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
            <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
              <Shield className="w-3 h-3" />
              <span>🔒 Private & Secure</span>
            </div>
          </div>
        </div>

        {/* Enhanced Chat Container */}
        <div className="flex-1 card rounded-3xl flex flex-col overflow-hidden animate-fade-in-up border border-white/20 dark:border-slate-700/20">
          
          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 animate-fade-in-up ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                  style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
                >
                  {/* Enhanced Avatar */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                  } ${message.sender === 'ai' ? 'animate-glow' : ''}`}>
                    {message.sender === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Enhanced Message Bubble */}
                  <div className={`max-w-2xl px-6 py-4 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white ml-auto'
                      : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-600'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    <p className={`text-xs mt-2 ${
                      message.sender === 'user' 
                        ? 'text-emerald-100' 
                        : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {formatTime(new Date(message.timestamp))}
                    </p>
                  </div>
                </div>
              ))}

              {/* Enhanced Typing Indicator */}
              {isTyping && (
                <div className="flex items-start space-x-3 animate-fade-in">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg animate-pulse">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white dark:bg-slate-700 px-6 py-4 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-600">
                    <div className="flex space-x-2 items-center">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Enhanced Input Area */}
          <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            
            {/* Quick Suggestions */}
            {suggestions.length > 0 && (
              <div className="mb-4 animate-fade-in-up">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 font-medium">Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(suggestion)}
                      className="px-4 py-2 text-sm bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-all duration-300 hover:scale-105"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-4">
              
              {/* Enhanced Voice Button */}
              <button
                onClick={startListening}
                disabled={isListening || isTyping}
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isListening
                    ? 'bg-red-500 text-white shadow-lg animate-pulse'
                    : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800/50'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Enhanced Text Input */}
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isTyping && sendMessage()}
                  placeholder="Share what's on your mind about sleep..."
                  disabled={isTyping}
                  className="form-control disabled:opacity-50"
                />
                {inputText && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                  </div>
                )}
              </div>

              {/* Enhanced Send Button */}
              <button
                onClick={() => sendMessage()}
                disabled={!inputText.trim() || isTyping}
                className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-xl transition-all duration-300 hover:scale-110 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {/* Voice Recording Indicator */}
            {isListening && (
              <div className="flex items-center justify-center mt-4 animate-fade-in">
                <div className="flex items-center space-x-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">🎤 Listening... Speak now</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;