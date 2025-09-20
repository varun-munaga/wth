export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  createdAt: Date;
}

export interface AnxietyAssessment {
  sleepAnxietyLevel: number;
  anxietyFrequency: number;
  sleepQuality: number;
  stressLevel: number;
  previousHelp: number;
}

export interface SleepEntry {
  id: string;
  date: string;
  type: 'evening' | 'morning';
  anxietyLevel?: number;
  bedtime?: string;
  wakeTime?: string;
  sleepQuality?: number;
  energyLevel?: number;
  triggers?: string[];
  voiceNote?: string;
  thoughts?: string;
  gratitude?: string;
  nightAnxiety?: boolean;
  nightAnxietyDetails?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

export interface AppData {
  user: User | null;
  assessment: AnxietyAssessment | null;
  sleepEntries: SleepEntry[];
  chatHistory: ChatMessage[];
  settings: {
    darkMode: boolean;
    fontSize: 'small' | 'medium' | 'large';
    notifications: boolean;
    demoMode: boolean;
  };
}