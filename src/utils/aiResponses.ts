import { SleepEntry } from '../types';

interface AIContext {
  recentEntries: SleepEntry[];
  commonTriggers: string[];
  averageAnxiety: number;
  improvementTrend: boolean;
}

const crisisKeywords = ['panic attack', 'can\'t cope', 'hopeless', 'want to die', 'end it all', 'give up'];

export const detectCrisis = (message: string): boolean => {
  return crisisKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  );
};

export const getCrisisResponse = (): string => {
  return `I'm really concerned about you right now. You're not alone in this. If you're having thoughts of self-harm, please reach out immediately:

• National Suicide Prevention Lifeline: 988
• Crisis Text Line: Text HOME to 741741
• Emergency Services: 911

Your feelings are valid, and there are people who want to help. Would you like me to help you find local mental health resources?`;
};

export const generateAIResponse = (userMessage: string, context: AIContext): string => {
  const message = userMessage.toLowerCase();
  
  if (detectCrisis(message)) {
    return getCrisisResponse();
  }
  
  // Time-based responses
  const hour = new Date().getHours();
  const isEvening = hour >= 18 || hour <= 6;
  
  if (message.includes('can\'t sleep') || message.includes('anxious') || message.includes('worried')) {
    return getAnxietyResponse(context, isEvening);
  }
  
  if (message.includes('breathing') || message.includes('technique') || message.includes('calm')) {
    return getBreathingTechnique(isEvening);
  }
  
  if (message.includes('worry') || message.includes('overthinking') || message.includes('thoughts')) {
    return getWorryManagement(context);
  }
  
  if (message.includes('routine') || message.includes('habit') || message.includes('schedule')) {
    return getRoutineAdvice(context);
  }
  
  if (message.includes('progress') || message.includes('better') || message.includes('improved')) {
    return getProgressResponse(context);
  }
  
  if (message.includes('tired') || message.includes('exhausted') || message.includes('drained')) {
    return getEnergyResponse(context);
  }
  
  if (message.includes('nightmare') || message.includes('dream') || message.includes('wake up')) {
    return getSleepDisturbanceResponse();
  }
  
  if (message.includes('medication') || message.includes('pill') || message.includes('drug')) {
    return getMedicationResponse();
  }
  
  if (context.improvementTrend) {
    return getEncouragementResponse(context);
  }
  
  return getGeneralSupportResponse(context);
};

const getAnxietyResponse = (context: AIContext, isEvening: boolean): string => {
  const responses = [
    `I notice you're feeling anxious about sleep. This creates a cycle - anxiety about sleep makes it harder to sleep, which increases anxiety. Let's break this cycle with progressive muscle relaxation: start by tensing your toes for 5 seconds, then release. Notice the contrast between tension and relaxation.`,
    
    `Sleep anxiety is incredibly common - you're not alone in this. Your brain is in "threat detection" mode when it should be in "rest mode." Try this: place one hand on your chest, one on your belly. Breathe so only the bottom hand moves. This signals safety to your nervous system.`,
    
    `I can see from your recent entries that ${context.commonTriggers[0] || 'stress'} has been a big trigger lately. When we're anxious about sleep, we often put too much pressure on it. Remember: rest is valuable even without perfect sleep.`
  ];
  
  if (isEvening) {
    return responses[0] + `\n\nSince it's evening, try dimming your lights and doing something calming for 30 minutes before bed. Your body needs time to transition from "alert" to "rest" mode.`;
  }
  
  return responses[Math.floor(Math.random() * responses.length)];
};

const getBreathingTechnique = (isEvening: boolean): string => {
  if (isEvening) {
    return `Perfect timing for a breathing exercise! Let's practice the 4-7-8 technique:

🌙 Evening Breathing (4-7-8):
1. Breathe in through your nose for 4 counts
2. Hold your breath for 7 counts  
3. Exhale through your mouth for 8 counts
4. Repeat 3-4 times

This naturally activates your parasympathetic nervous system and signals "safety" to your body. Focus only on counting - let other thoughts drift away like clouds.

Try this right now, and notice how your body starts to feel more relaxed.`;
  }
  
  return `The 4-7-8 breathing technique is great anytime you feel anxious:

1. Breathe in through your nose for 4 counts
2. Hold your breath for 7 counts  
3. Exhale through your mouth for 8 counts
4. Repeat 3-4 times

This technique works by increasing carbon dioxide in your blood, which naturally calms your nervous system. It's like a natural sedative!`;
};

const getWorryManagement = (context: AIContext): string => {
  return `Overthinking is so common, especially at bedtime. Your brain is trying to protect you by thinking ahead, but bedtime thinking rarely leads to solutions.

Try this "worry dump" technique:

1. Write down your 3 biggest worries
2. For each worry, ask: "Can I do anything about this right now?"
3. If yes, write one small action for tomorrow
4. If no, remind yourself: "This worry will still exist tomorrow if I need it, but right now is time for rest"

${context.commonTriggers.includes('Overthinking') ? 'I notice overthinking is a common trigger for you. This technique can help break that pattern.' : ''}

Remember: Your brain is trying to help, but it's not very good at solving problems when you're tired.`;
};

const getProgressResponse = (context: AIContext): string => {
  if (context.improvementTrend) {
    return `That's wonderful to hear! I can see real progress in your sleep anxiety patterns. Your average anxiety level has decreased, and you're building awareness of your triggers.

${context.commonTriggers.length > 0 ? `You're getting better at managing ${context.commonTriggers[0]}` : 'Keep up the great work'}!

Remember, healing isn't linear - there will be good nights and challenging nights. The important thing is that you're building skills and awareness. Celebrate these improvements!`;
  }
  
  return `It's great that you're noticing improvements! Even small changes matter. What specific things have been helping you feel more peaceful at bedtime?`;
};

const getEnergyResponse = (context: AIContext): string => {
  return `Feeling drained is so common with sleep anxiety. When we're anxious about sleep, our bodies stay in "fight or flight" mode, which is exhausting.

Here are some gentle energy boosters:

🌅 Morning:
- Get sunlight within 30 minutes of waking
- Gentle movement (even just stretching)
- Hydrate with water (not just coffee)

🌙 Evening:
- Avoid caffeine after 2 PM
- Light dinner, not too heavy
- Wind down activities (reading, gentle music)

Remember: Your body is working hard to keep you safe. Be patient and gentle with yourself.`;
};

const getSleepDisturbanceResponse = (): string => {
  return `Sleep disturbances like nightmares or frequent waking are common with anxiety. Your brain is in "alert mode" even during sleep.

If you wake up anxious:
1. Don't check the time (this creates pressure)
2. Practice the 4-7-8 breathing technique
3. Remind yourself: "I'm safe, I'm in my bed, I can rest"
4. If you can't sleep, rest is still valuable

Nightmares often reflect daytime stress. Consider journaling about your day to process emotions before bed.

You're not broken - your brain is just trying to protect you.`;
};

const getMedicationResponse = (): string => {
  return `I understand you're asking about medication. I can't provide medical advice, but I can share some general information:

💊 Important considerations:
- Always consult with a healthcare provider
- Sleep medications can be helpful short-term
- They work best combined with therapy and lifestyle changes
- Some can become habit-forming

🌱 Natural alternatives to discuss with your doctor:
- Melatonin (timing is important)
- Magnesium supplements
- Valerian root or chamomile tea
- CBT-I (Cognitive Behavioral Therapy for Insomnia)

Remember: There's no shame in needing help. Sleep anxiety is a real medical condition that deserves proper treatment.`;
};

const getRoutineAdvice = (context: AIContext): string => {
  if (context.commonTriggers.includes('Social Media')) {
    return `I notice social media is a common trigger for you. The blue light and stimulating content can increase cortisol levels. Try creating a "digital sunset" - put devices away 1 hour before your ideal bedtime. Replace scrolling with reading, gentle stretching, or journaling.`;
  }
  
  return `Based on your patterns, you sleep better when you have a consistent routine. Try this gentle bedtime sequence: dim the lights, do something calm for 30 minutes (reading, stretching, quiet music), then go to bed at the same time each night. Consistency signals safety to your nervous system.`;
};

const getEncouragementResponse = (context: AIContext): string => {
  return `I'm seeing real progress in your sleep anxiety! Your average anxiety level has decreased, and you're building awareness of your patterns. ${context.commonTriggers.length > 0 ? `You're getting better at managing ${context.commonTriggers[0]}` : 'Keep up the great work'}. Remember, healing isn't linear - celebrate these improvements!`;
};

const getGeneralSupportResponse = (context: AIContext): string => {
  return `Thank you for sharing with me. Managing sleep anxiety takes courage, and you're doing important work by tracking your patterns and reaching out for support. What's one small thing that helped you feel even slightly more peaceful recently?`;
};