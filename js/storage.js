/* ================================
   STREAK GUARDIAN - STORAGE
   localStorage management with error handling
   ================================ */

const Storage = {
  
  // Check if localStorage is available
  isAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.error('localStorage not available:', e);
      return false;
    }
  },
  
  // Get item with fallback
  get(key, defaultValue = null) {
    if (!this.isAvailable()) return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      
      // Try to parse JSON, return as-is if not JSON
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    } catch (e) {
      console.error(`Error getting ${key}:`, e);
      return defaultValue;
    }
  },
  
  // Set item
  set(key, value) {
    if (!this.isAvailable()) {
      console.error('Cannot save data: localStorage not available');
      return false;
    }
    
    try {
      const stringValue = typeof value === 'string' 
        ? value 
        : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
      return true;
    } catch (e) {
      console.error(`Error setting ${key}:`, e);
      return false;
    }
  },
  
  // Remove item
  remove(key) {
    if (!this.isAvailable()) return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error(`Error removing ${key}:`, e);
      return false;
    }
  },
  
  // Clear all data
  clear() {
    if (!this.isAvailable()) return false;
    
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.error('Error clearing storage:', e);
      return false;
    }
  },
  
  // Export all data as JSON
  exportAll() {
    if (!this.isAvailable()) return null;
    
    try {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data[key] = this.get(key);
      }
      return data;
    } catch (e) {
      console.error('Error exporting data:', e);
      return null;
    }
  },
  
  // Import data from JSON
  importAll(data) {
    if (!this.isAvailable()) return false;
    
    try {
      Object.entries(data).forEach(([key, value]) => {
        this.set(key, value);
      });
      return true;
    } catch (e) {
      console.error('Error importing data:', e);
      return false;
    }
  }
};

// App-specific storage keys
const STORAGE_KEYS = {
  // Onboarding
  ONBOARDING_COMPLETED: 'onboardingCompleted',
  
  // User data
  COMPANION_TYPE: 'companionType',         // 'plant', 'cat', 'dog', 'bird', 'dragon', 'flame'
  COMPANION_NAME: 'companionName',
  ADDICTION_TYPE: 'addictionType',
  ADDICTION_CUSTOM: 'addictionCustom',     // For custom addiction
  
  // Streak tracking
  START_DATE: 'startDate',                 // ISO string
  STREAK_DAYS: 'streakDays',              // Number
  LAST_CHECK_IN: 'lastCheckInDate',       // Date string YYYY-MM-DD
  LONGEST_STREAK: 'longestStreak',        // Number
  
  // Check-in history
  DAILY_CHECK_INS: 'dailyCheckIns',       // Array of date strings
  FAILED_DATES: 'failedDates',            // Array of date strings
  
  // SOS tracking
  SOS_COUNT: 'sosEventsCount',            // Number
  SOS_HISTORY: 'sosHistory',              // Array of {date, trigger}
  CRAVING_NOTES: 'cravingNotes',          // Array of {date, note}
  
  // Savings
  DAILY_COST: 'dailyCost',                // Number
  
  // Streak history (for stats)
  STREAK_HISTORY: 'streakHistory',        // Array of {startDate, endDate, days}
  
  // Evolution tracking
  EVOLUTIONS_SEEN: 'evolutionsSeen',      // Array of milestone days
  
  // Settings
  NOTIFICATIONS_ENABLED: 'notificationsEnabled',
  CHECK_IN_TIME: 'checkInTime',           // Time string HH:MM
  THEME: 'theme',                          // 'light', 'dark', 'auto'
  SOUNDS_ENABLED: 'soundsEnabled'         // Boolean
};

// Helper functions for common operations
const AppStorage = {
  
  // Onboarding
  isOnboardingComplete() {
    return Storage.get(STORAGE_KEYS.ONBOARDING_COMPLETED) === true;
  },
  
  completeOnboarding(data) {
    Storage.set(STORAGE_KEYS.ONBOARDING_COMPLETED, true);
    Storage.set(STORAGE_KEYS.COMPANION_TYPE, data.companionType);
    Storage.set(STORAGE_KEYS.COMPANION_NAME, data.companionName);
    Storage.set(STORAGE_KEYS.ADDICTION_TYPE, data.addictionType);
    if (data.addictionCustom) {
      Storage.set(STORAGE_KEYS.ADDICTION_CUSTOM, data.addictionCustom);
    }
    Storage.set(STORAGE_KEYS.START_DATE, new Date().toISOString());
    Storage.set(STORAGE_KEYS.STREAK_DAYS, 0);
    Storage.set(STORAGE_KEYS.LONGEST_STREAK, 0);
    Storage.set(STORAGE_KEYS.LAST_CHECK_IN, '');
    Storage.set(STORAGE_KEYS.DAILY_CHECK_INS, []);
    Storage.set(STORAGE_KEYS.FAILED_DATES, []);
    Storage.set(STORAGE_KEYS.SOS_COUNT, 0);
    Storage.set(STORAGE_KEYS.EVOLUTIONS_SEEN, []);
  },
  
  // Companion
  getCompanionType() {
    return Storage.get(STORAGE_KEYS.COMPANION_TYPE, 'plant');
  },
  
  getCompanionName() {
    const customName = Storage.get(STORAGE_KEYS.COMPANION_NAME);
    if (customName) return customName;
    
    // Default names based on type
    const type = this.getCompanionType();
    const defaults = {
      plant: 'la tua pianta',
      animal: 'il tuo compagno',
      flame: 'la tua fiamma'
    };
    return defaults[type] || 'il tuo compagno';
  },
  
  setCompanionName(name) {
    return Storage.set(STORAGE_KEYS.COMPANION_NAME, name);
  },
  
  setCompanionType(type) {
    return Storage.set(STORAGE_KEYS.COMPANION_TYPE, type);
  },
  
  // Addiction
  getAddictionType() {
    return Storage.get(STORAGE_KEYS.ADDICTION_TYPE, '');
  },
  
  getAddictionName() {
    const type = this.getAddictionType();
    if (type === 'custom') {
      return Storage.get(STORAGE_KEYS.ADDICTION_CUSTOM, 'questa dipendenza');
    }
    
    const names = {
      'social-media': 'Social Media',
      'gaming': 'Gaming',
      'shopping': 'Shopping',
      'pornography': 'Pornografia',
      'procrastination': 'Procrastinazione',
      'gambling': 'Gambling',
      'smoking': 'Fumo',
      'alcohol': 'Alcol',
      'cannabis': 'Cannabis',
      'drugs': 'Droghe',
      'binge-eating': 'Abbuffate',
      'sugar': 'Zucchero',
      'caffeine': 'Caffeina',
      'skin-picking': 'Skin Picking',
      'nail-biting': 'Unghie',
      'toxic-relationship': 'Relazione tossica'
    };
    
    return names[type] || type;
  },
  
  setAddictionType(type, customName = null) {
    Storage.set(STORAGE_KEYS.ADDICTION_TYPE, type);
    if (customName) {
      Storage.set(STORAGE_KEYS.ADDICTION_CUSTOM, customName);
    }
  },
  
  // Streak
  getCurrentStreak() {
    return Storage.get(STORAGE_KEYS.STREAK_DAYS, 0);
  },
  
  getLongestStreak() {
    const current = this.getCurrentStreak();
    const longest = Storage.get(STORAGE_KEYS.LONGEST_STREAK, 0);
    return Math.max(current, longest);
  },
  
  incrementStreak() {
    const current = this.getCurrentStreak();
    const newStreak = current + 1;
    Storage.set(STORAGE_KEYS.STREAK_DAYS, newStreak);
    
    // Update longest if needed
    const longest = this.getLongestStreak();
    if (newStreak > longest) {
      Storage.set(STORAGE_KEYS.LONGEST_STREAK, newStreak);
    }
    
    return newStreak;
  },
  
  resetStreak() {
    const currentStreak = this.getCurrentStreak();
    
    // Save to history if streak was > 0
    if (currentStreak > 0) {
      const history = Storage.get(STORAGE_KEYS.STREAK_HISTORY, []);
      const startDate = Storage.get(STORAGE_KEYS.START_DATE);
      history.push({
        startDate: startDate,
        endDate: new Date().toISOString(),
        days: currentStreak
      });
      Storage.set(STORAGE_KEYS.STREAK_HISTORY, history);
    }
    
    // Reset
    Storage.set(STORAGE_KEYS.STREAK_DAYS, 0);
    Storage.set(STORAGE_KEYS.START_DATE, new Date().toISOString());
    
    // Record failed date
    const today = this.getTodayString();
    const failedDates = Storage.get(STORAGE_KEYS.FAILED_DATES, []);
    if (!failedDates.includes(today)) {
      failedDates.push(today);
      Storage.set(STORAGE_KEYS.FAILED_DATES, failedDates);
    }
    
    return true;
  },
  
  // Check-in
  getTodayString() {
    const date = new Date();
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  },
  
  hasCheckedInToday() {
    const today = this.getTodayString();
    const lastCheckIn = Storage.get(STORAGE_KEYS.LAST_CHECK_IN, '');
    return lastCheckIn === today;
  },
  
  checkIn() {
    const today = this.getTodayString();
    
    // Record check-in
    Storage.set(STORAGE_KEYS.LAST_CHECK_IN, today);
    
    // Add to history
    const checkIns = Storage.get(STORAGE_KEYS.DAILY_CHECK_INS, []);
    if (!checkIns.includes(today)) {
      checkIns.push(today);
      Storage.set(STORAGE_KEYS.DAILY_CHECK_INS, checkIns);
    }
    
    // Increment streak
    return this.incrementStreak();
  },
  
  // SOS
  incrementSOSCount() {
    const count = Storage.get(STORAGE_KEYS.SOS_COUNT, 0);
    const newCount = count + 1;
    Storage.set(STORAGE_KEYS.SOS_COUNT, newCount);
    
    // Add to history
    const history = Storage.get(STORAGE_KEYS.SOS_HISTORY, []);
    history.push({
      date: new Date().toISOString(),
      trigger: null // Can be expanded later
    });
    Storage.set(STORAGE_KEYS.SOS_HISTORY, history);
    
    return newCount;
  },
  
  getSOSCount() {
    return Storage.get(STORAGE_KEYS.SOS_COUNT, 0);
  },
  
  // Craving notes
  saveCravingNote(note) {
    const notes = Storage.get(STORAGE_KEYS.CRAVING_NOTES, []);
    notes.push({
      date: new Date().toISOString(),
      note: note
    });
    Storage.set(STORAGE_KEYS.CRAVING_NOTES, notes);
  },
  
  // Savings
  getDailyCost() {
    return Storage.get(STORAGE_KEYS.DAILY_COST, 0);
  },
  
  setDailyCost(cost) {
    return Storage.set(STORAGE_KEYS.DAILY_COST, parseFloat(cost) || 0);
  },
  
  getTotalSaved() {
    const cost = this.getDailyCost();
    const days = this.getCurrentStreak();
    return (cost * days).toFixed(2);
  },
  
  // Evolution tracking
  hasSeenEvolution(milestone) {
    const seen = Storage.get(STORAGE_KEYS.EVOLUTIONS_SEEN, []);
    return seen.includes(milestone);
  },
  
  markEvolutionSeen(milestone) {
    const seen = Storage.get(STORAGE_KEYS.EVOLUTIONS_SEEN, []);
    if (!seen.includes(milestone)) {
      seen.push(milestone);
      Storage.set(STORAGE_KEYS.EVOLUTIONS_SEEN, seen);
    }
  },
  
  // Start date
  getStartDate() {
    return Storage.get(STORAGE_KEYS.START_DATE, new Date().toISOString());
  },
  
  getStartDateFormatted() {
    const dateStr = this.getStartDate();
    const date = new Date(dateStr);
    return date.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  },
  
  // Check-in history
  getCheckInHistory() {
    return Storage.get(STORAGE_KEYS.DAILY_CHECK_INS, []);
  },
  
  getFailedDates() {
    return Storage.get(STORAGE_KEYS.FAILED_DATES, []);
  },
  
  // Complete reset
  resetAll() {
    // Save current data for potential recovery
    const backup = Storage.exportAll();
    console.log('Backup created before reset:', backup);
    
    // Clear everything
    Storage.clear();
    
    return true;
  },
  
  // Export for user download
  exportUserData() {
    return {
      companionName: this.getCompanionName(),
      companionType: this.getCompanionType(),
      addictionType: this.getAddictionType(),
      addictionName: this.getAddictionName(),
      startDate: this.getStartDate(),
      streakDays: this.getCurrentStreak(),
      longestStreak: this.getLongestStreak(),
      dailyCheckIns: this.getCheckInHistory(),
      failedDates: this.getFailedDates(),
      sosCount: this.getSOSCount(),
      dailyCost: this.getDailyCost(),
      totalSaved: this.getTotalSaved(),
      streakHistory: Storage.get(STORAGE_KEYS.STREAK_HISTORY, []),
      cravingNotes: Storage.get(STORAGE_KEYS.CRAVING_NOTES, []),
      exportDate: new Date().toISOString()
    };
  }
};

// Make available globally
window.Storage = Storage;
window.AppStorage = AppStorage;
window.STORAGE_KEYS = STORAGE_KEYS;
