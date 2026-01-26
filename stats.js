/* ================================
   STREAK GUARDIAN - STATS
   Statistics calculation and display
   ================================ */

const Stats = {
  
  // Render calendar for last 30 days
  renderCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) return;
    
    calendarGrid.innerHTML = '';
    
    const checkIns = AppStorage.getCheckInHistory();
    const failedDates = AppStorage.getFailedDates();
    const today = new Date();
    
    // Calculate 30 days ago
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    
    // Get start of week (Monday)
    const startDate = new Date(thirtyDaysAgo);
    const day = startDate.getDay();
    const diff = day === 0 ? 6 : day - 1; // Adjust so Monday = 0
    startDate.setDate(startDate.getDate() - diff);
    
    // Render up to 35 days (5 weeks) to fill grid
    for (let i = 0; i < 35; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      
      const dateString = currentDate.toISOString().split('T')[0];
      const isInRange = currentDate >= thirtyDaysAgo && currentDate <= today;
      const isFuture = currentDate > today;
      
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day';
      
      if (!isInRange) {
        dayElement.style.opacity = '0.2';
        dayElement.textContent = '⬜';
      } else if (isFuture) {
        dayElement.textContent = '⬜';
      } else if (failedDates.includes(dateString)) {
        dayElement.textContent = '❌';
      } else if (checkIns.includes(dateString)) {
        dayElement.textContent = '✅';
      } else {
        // Day in range but no check-in (missed or before start)
        const startDate = new Date(AppStorage.getStartDate());
        if (currentDate >= startDate) {
          dayElement.textContent = '❌';
        } else {
          dayElement.textContent = '⬜';
          dayElement.style.opacity = '0.2';
        }
      }
      
      calendarGrid.appendChild(dayElement);
    }
  },
  
  // Update all stats on the stats page
  updateStatsPage() {
    // Current streak
    const currentStreak = AppStorage.getCurrentStreak();
    const currentElement = document.getElementById('current-streak');
    if (currentElement) {
      const daysText = currentStreak === 1 ? 'giorno' : 'giorni';
      currentElement.textContent = `${currentStreak} ${daysText}`;
    }
    
    // Longest streak
    const longestStreak = AppStorage.getLongestStreak();
    const longestElement = document.getElementById('longest-streak');
    if (longestElement) {
      const daysText = longestStreak === 1 ? 'giorno 🏆' : 'giorni 🏆';
      longestElement.textContent = `${longestStreak} ${daysText}`;
    }
    
    // Start date
    const startDateElement = document.getElementById('start-date');
    if (startDateElement) {
      startDateElement.textContent = AppStorage.getStartDateFormatted();
    }
    
    // SOS count
    const sosCountElement = document.getElementById('sos-count');
    if (sosCountElement) {
      sosCountElement.textContent = `${AppStorage.getSOSCount()} 💪`;
    }
    
    // Render calendar
    this.renderCalendar();
    
    // Update savings if enabled
    this.updateSavings();
    
    // Update milestone progress
    this.updateMilestone();
  },
  
  // Update savings display
  updateSavings() {
    const dailyCost = AppStorage.getDailyCost();
    const savingsSection = document.getElementById('savings-section');
    
    if (!savingsSection) return;
    
    if (dailyCost > 0) {
      savingsSection.style.display = 'block';
      
      const totalSaved = AppStorage.getTotalSaved();
      const streakDays = AppStorage.getCurrentStreak();
      
      // Update amount
      const amountElement = document.getElementById('savings-amount');
      if (amountElement) {
        amountElement.textContent = `€${totalSaved}`;
      }
      
      // Update days
      const daysElement = document.getElementById('savings-days');
      if (daysElement) {
        daysElement.textContent = streakDays;
      }
      
      // Generate examples
      this.updateSavingsExamples(parseFloat(totalSaved));
    } else {
      savingsSection.style.display = 'none';
    }
  },
  
  // Generate savings examples
  updateSavingsExamples(total) {
    const examplesContainer = document.getElementById('savings-examples');
    if (!examplesContainer) return;
    
    examplesContainer.innerHTML = '';
    
    const examples = [];
    
    if (total >= 10) examples.push('📚 2 libri');
    if (total >= 20) examples.push('🍕 2 pizze');
    if (total >= 30) examples.push('🎬 3 cinema');
    if (total >= 50) examples.push('👕 Una maglietta');
    if (total >= 100) examples.push('🎮 Un videogioco');
    if (total >= 200) examples.push('📱 Un gadget tech');
    if (total >= 500) examples.push('✈️ Un weekend fuori');
    
    // Show maximum 3 examples
    const displayExamples = examples.slice(-3);
    
    if (displayExamples.length > 0) {
      displayExamples.forEach(example => {
        const span = document.createElement('span');
        span.className = 'savings-example';
        span.textContent = example;
        examplesContainer.appendChild(span);
      });
    } else {
      examplesContainer.innerHTML = '<span class="savings-example">Continua a risparmiare! 💰</span>';
    }
  },
  
  // Update milestone progress
  updateMilestone() {
    const companionType = AppStorage.getCompanionType();
    const currentStreak = AppStorage.getCurrentStreak();
    const nextMilestone = Companion.getNextMilestone(companionType, currentStreak);
    
    const textElement = document.getElementById('milestone-text');
    const progressElement = document.getElementById('progress-fill');
    const labelElement = document.getElementById('progress-label');
    
    if (!nextMilestone) {
      // At max evolution
      if (textElement) {
        textElement.textContent = 'Hai raggiunto la massima evoluzione! Continua così! 🌟';
      }
      if (progressElement) {
        progressElement.style.width = '100%';
      }
      if (labelElement) {
        labelElement.textContent = `${currentStreak}/${currentStreak}`;
      }
      return;
    }
    
    const daysUntil = nextMilestone.days - currentStreak;
    const companionName = AppStorage.getCompanionName();
    
    if (textElement) {
      const daysText = daysUntil === 1 ? 'giorno' : 'giorni';
      textElement.textContent = `Tra ${daysUntil} ${daysText} ${companionName} evolverà! 🎉`;
    }
    
    // Calculate progress
    const previousMilestone = this.getPreviousMilestone(companionType, currentStreak);
    const start = previousMilestone ? previousMilestone.days : 0;
    const end = nextMilestone.days;
    const progress = ((currentStreak - start) / (end - start)) * 100;
    
    if (progressElement) {
      progressElement.style.width = `${Math.min(progress, 100)}%`;
    }
    
    if (labelElement) {
      labelElement.textContent = `${currentStreak}/${nextMilestone.days}`;
    }
  },
  
  // Get previous milestone
  getPreviousMilestone(companionType, streakDays) {
    const milestones = Companion.MILESTONES[companionType] || Companion.MILESTONES.plant;
    
    let previous = null;
    for (const milestone of milestones) {
      if (streakDays >= milestone.days) {
        previous = milestone;
      } else {
        break;
      }
    }
    
    return previous;
  },
  
  // Calculate total days clean (including past streaks)
  getTotalDaysClean() {
    const currentStreak = AppStorage.getCurrentStreak();
    const history = Storage.get(STORAGE_KEYS.STREAK_HISTORY, []);
    
    const historyDays = history.reduce((sum, streak) => sum + streak.days, 0);
    
    return currentStreak + historyDays;
  },
  
  // Get achievement badges
  getAchievements() {
    const streak = AppStorage.getCurrentStreak();
    const sosCount = AppStorage.getSOSCount();
    const achievements = [];
    
    // Streak achievements
    if (streak >= 3) achievements.push({ emoji: '🌱', name: 'Primi Passi', desc: '3 giorni' });
    if (streak >= 7) achievements.push({ emoji: '🔥', name: 'Una Settimana', desc: '7 giorni' });
    if (streak >= 30) achievements.push({ emoji: '🌟', name: 'Un Mese', desc: '30 giorni' });
    if (streak >= 100) achievements.push({ emoji: '💯', name: 'Centenario', desc: '100 giorni' });
    if (streak >= 365) achievements.push({ emoji: '🏆', name: 'Un Anno', desc: '365 giorni' });
    
    // SOS achievements
    if (sosCount >= 10) achievements.push({ emoji: '💪', name: 'Resistente', desc: '10 SOS superati' });
    if (sosCount >= 50) achievements.push({ emoji: '🛡️', name: 'Guerriero', desc: '50 SOS superati' });
    
    return achievements;
  },
  
  // Format date for display
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  },
  
  // Get day of week
  getDayOfWeek(dateString) {
    const date = new Date(dateString);
    const days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    return days[date.getDay()];
  }
};

// Make available globally
window.Stats = Stats;
