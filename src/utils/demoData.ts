import { SleepEntry, ChatMessage } from '../types';
import { subDays, format } from 'date-fns';

export const generateDemoEntries = (): SleepEntry[] => {
  const entries: SleepEntry[] = [];
  const today = new Date();
  
  // Generate 14 days of demo data
  for (let i = 13; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Evening entry
    const eveningAnxiety = i > 7 ? 7 + Math.random() * 2 : 3 + Math.random() * 3;
    entries.push({
      id: `evening-${dateStr}`,
      date: dateStr,
      type: 'evening',
      anxietyLevel: Math.round(eveningAnxiety),
      bedtime: i > 7 ? '23:45' : '22:30',
      triggers: i > 7 ? ['Academic Stress', 'Overthinking'] : ['Social Media'],
      thoughts: i > 7 ? 'Worried about tomorrow...' : 'Feeling more peaceful tonight'
    });
    
    // Morning entry
    const sleepQuality = i > 7 ? 3 + Math.random() * 2 : 6 + Math.random() * 3;
    entries.push({
      id: `morning-${dateStr}`,
      date: dateStr,
      type: 'morning',
      sleepQuality: Math.round(sleepQuality),
      wakeTime: '07:00',
      energyLevel: Math.round(sleepQuality + 1),
      nightAnxiety: i > 7,
      gratitude: 'Thankful for a new day'
    });
  }
  
  return entries;
};

export const generateDemoChat = (): ChatMessage[] => {
  return [
    {
      id: '1',
      type: 'user',
      content: "I'm really anxious about sleeping tonight. I have an exam tomorrow.",
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: '2',
      type: 'ai',
      content: "I can see you're really struggling with exam stress tonight. Let's try the 4-7-8 breathing technique - breathe in for 4, hold for 7, out for 8. This activates your parasympathetic nervous system and naturally reduces anxiety.",
      timestamp: new Date(Date.now() - 3590000)
    },
    {
      id: '3',
      type: 'user',
      content: "That helped a bit. But I keep thinking about all the things I need to remember.",
      timestamp: new Date(Date.now() - 1800000)
    },
    {
      id: '4',
      type: 'ai',
      content: "Great progress! I noticed you slept much better this week when you wrote your worries down before bed. Would you like to try a 'worry dump' exercise? Write down 3 main concerns, then remind yourself they'll be there tomorrow but right now is time for rest.",
      timestamp: new Date(Date.now() - 1790000)
    }
  ];
};