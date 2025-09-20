import { AppData } from '../types';

const STORAGE_KEY = 'sleepsense-data';

export const saveData = (data: Partial<AppData>): void => {
  try {
    const existingData = loadData();
    const updatedData = { ...existingData, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const loadData = (): AppData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
  
  return {
    user: null,
    assessment: null,
    sleepEntries: [],
    chatHistory: [],
    settings: {
      darkMode: false,
      fontSize: 'medium',
      notifications: true,
      demoMode: false
    }
  };
};

export const clearData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};