/* ================================
   STREAK GUARDIAN - COMPANION
   Companion evolution and display logic
   ================================ */

const Companion = {
  
  // Evolution thresholds for each companion type
  MILESTONES: {
    plant: [
      { days: 0, emoji: '🌱', name: 'Germoglio' },
      { days: 3, emoji: '🌿', name: 'Piantina' },
      { days: 7, emoji: '🪴', name: 'Pianta in Vaso' },
      { days: 30, emoji: '🌳', name: 'Albero Maestoso' }
    ],
    animal: [
      { days: 0, emoji: '🥚', name: 'Uovo' },
      { days: 3, emoji: '🐣', name: 'Cucciolo' },
      { days: 7, emoji: '🐕', name: 'Adolescente' },
      { days: 30, emoji: '🦁', name: 'Protettore' }
    ],
    flame: [
      { days: 0, emoji: '✨', name: 'Scintilla' },
      { days: 3, emoji: '🔥', name: 'Fiamma' },
      { days: 7, emoji: '🔥🔥', name: 'Grande Fuoco' },
      { days: 30, emoji: 'phoenix', name: 'Fenice' }
    ]
  },
  
  // Get current companion state based on streak days
  getCurrentState(companionType, streakDays) {
    const milestones = this.MILESTONES[companionType] || this.MILESTONES.plant;
    
    // Find the highest milestone reached
    let currentState = milestones[0];
    for (const milestone of milestones) {
      if (streakDays >= milestone.days) {
        currentState = milestone;
      } else {
        break;
      }
    }
    
    return currentState;
  },
  
  // Get next evolution milestone
  getNextMilestone(companionType, streakDays) {
    const milestones = this.MILESTONES[companionType] || this.MILESTONES.plant;
    
    for (const milestone of milestones) {
      if (streakDays < milestone.days) {
        return milestone;
      }
    }
    
    // Already at max evolution
    return null;
  },
  
  // Get evolution message
  getEvolutionMessage(companionType, streakDays) {
    const nextMilestone = this.getNextMilestone(companionType, streakDays);
    
    if (!nextMilestone) {
      // At max evolution
      const messages = {
        plant: 'Il tuo albero è maestoso! Continua così! 🌳',
        animal: 'Il tuo compagno è un protettore! Siete una squadra! 🦁',
        flame: 'Sei rinato come fenice! Inarrestabile! 🔥🦅'
      };
      return messages[companionType] || 'Continua così! 💪';
    }
    
    const daysUntil = nextMilestone.days - streakDays;
    
    // Different messages based on companion type
    const messages = {
      plant: {
        3: `Tra ${daysUntil} ${daysUntil === 1 ? 'giorno' : 'giorni'} spunterà il germoglio`,
        7: `Tra ${daysUntil} ${daysUntil === 1 ? 'giorno' : 'giorni'} diventerà un arbusto`,
        30: `Tra ${daysUntil} ${daysUntil === 1 ? 'giorno' : 'giorni'} sarà un albero maestoso`
      },
      animal: {
        3: `Tra ${daysUntil} ${daysUntil === 1 ? 'giorno' : 'giorni'} l'uovo si schiuderà`,
        7: `Tra ${daysUntil} ${daysUntil === 1 ? 'giorno' : 'giorni'} il cucciolo crescerà`,
        30: `Tra ${daysUntil} ${daysUntil === 1 ? 'giorno' : 'giorni'} diventerà un protettore`
      },
      flame: {
        3: `Tra ${daysUntil} ${daysUntil === 1 ? 'giorno' : 'giorni'} diventerai una fiamma`,
        7: `Tra ${daysUntil} ${daysUntil === 1 ? 'giorno' : 'giorni'} diventerai un grande fuoco`,
        30: `Tra ${daysUntil} ${daysUntil === 1 ? 'giorno' : 'giorni'} rinascerai come fenice`
      }
    };
    
    return messages[companionType][nextMilestone.days] || 'Continua il tuo viaggio!';
  },
  
  // Get personalized message based on companion type and context
  getPersonalizedMessage(companionType, context = 'general') {
    const companionName = AppStorage.getCompanionName();
    
    const messages = {
      plant: {
        general: `Le radici di ${companionName} si fanno più profonde ogni giorno. Stai costruendo fondamenta solide.`,
        sos: `${companionName} è qui con te. Come un albero nella tempesta, puoi resistere. La crescita vera avviene anche nei momenti difficili.`,
        evolution: `${companionName} è cresciuto grazie alla tua dedizione! Continua a nutrire le tue radici. 🌱`,
        reset: `Anche ${companionName} crede in te. Ogni seme ha bisogno di tempo per germogliare di nuovo. Ripartiamo insieme. 🌱`,
        milestone: `${companionName} fiorisce grazie alla tua determinazione! Sei più forte di quanto pensi! 🌸`,
        checkin: `${companionName} cresce un altro giorno! Le radici diventano più profonde. 🌿`
      },
      animal: {
        general: `${companionName} conta su di te, e tu non sei mai solo in questo viaggio. Siete una squadra.`,
        sos: `${companionName} sente che hai bisogno di supporto. Non sei solo. Siete una squadra e supererete questo momento insieme.`,
        evolution: `${companionName} è cresciuto al tuo fianco! State diventando più forti insieme! 🐾`,
        reset: `${companionName} non ti abbandona mai. I veri compagni restano anche quando cadi. Rialzati, c'è qualcuno che crede in te. 💙`,
        milestone: `${companionName} è incredibilmente fiero di te! Guarda quanto siete cresciuti insieme! 🦁`,
        checkin: `${companionName} gioisce! Un altro giorno insieme, un passo avanti! 🐕`
      },
      flame: {
        general: `Ogni giorno ${companionName} brucia più forte. La tua fiamma interiore è potente e nulla può spegnerla.`,
        sos: `${companionName} ti ricorda: anche nei momenti di oscurità, la tua luce può tornare. Sei più forte del desiderio.`,
        evolution: `${companionName} arde con intensità rinnovata! Sei un fuoco che non può essere spento! 🔥`,
        reset: `Come ${companionName}, puoi rinascere dalle ceneri. La fenice cade per risorgere più forte. Questa non è la fine. 🔥`,
        milestone: `${companionName} brucia luminoso come mai prima! Sei una forza inarrestabile della natura! ✨`,
        checkin: `${companionName} divampa! La tua fiamma brucia sempre più forte! 🔥`
      }
    };
    
    return messages[companionType]?.[context] || `${companionName} è con te! 💚`;
  },
  
  // Check if it's time to show evolution celebration
  shouldShowEvolution(streakDays) {
    const milestones = [3, 7, 30];
    
    // Check if just reached a milestone and haven't seen it yet
    for (const milestone of milestones) {
      if (streakDays === milestone && !AppStorage.hasSeenEvolution(milestone)) {
        return milestone;
      }
    }
    
    return null;
  },
  
  // Show evolution celebration
  showEvolutionCelebration(milestone) {
    const companionType = AppStorage.getCompanionType();
    const companionName = AppStorage.getCompanionName();
    
    // Get old and new state
    const oldState = this.getCurrentState(companionType, milestone - 1);
    const newState = this.getCurrentState(companionType, milestone);
    
    // Update overlay content
    const oldEmojiEl = document.getElementById('old-emoji');
    const newEmojiEl = document.getElementById('new-emoji');
    
    if (oldEmojiEl) {
      oldEmojiEl.textContent = oldState.emoji;
    }
    
    if (newEmojiEl) {
      if (newState.emoji === 'phoenix') {
        newEmojiEl.innerHTML = '<img src="/assets/phoenix.svg" alt="Fenice" style="width: 80px; height: 80px;">';
      } else {
        newEmojiEl.textContent = newState.emoji;
      }
    }
    
    const messages = {
      3: `${companionName} è cresciuto!`,
      7: `${companionName} continua ad evolversi!`,
      30: `${companionName} ha raggiunto la sua forma finale!`
    };
    
    document.getElementById('evolution-message').textContent = 
      messages[milestone] || `${companionName} è cresciuto!`;
    
    const submessages = {
      3: `Sei al giorno ${milestone}. Ottimo inizio! 🎉`,
      7: `Sei al giorno ${milestone}. Stai facendo alla grande! 💪`,
      30: `Sei al giorno ${milestone}. Sei una leggenda! 🌟`
    };
    
    document.getElementById('evolution-submessage').textContent = 
      submessages[milestone] || 'Continua così!';
    
    // Show overlay
    document.getElementById('evolution-overlay').style.display = 'flex';
    
    // Generate confetti (increased amount)
    this.generateConfetti();
    
    // Mark as seen
    AppStorage.markEvolutionSeen(milestone);
    
    // Optional: Vibrate (longer duration)
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200, 50, 300]);
    }
  },
  
  // Generate confetti particles
  generateConfetti() {
    const confettiContainer = document.getElementById('confetti');
    const emojis = ['🎉', '✨', '⭐', '🌟', '💫', '🎊', '🔥', '💪'];
    
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'particle';
        confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.setProperty('--tx', (Math.random() - 0.5) * 200 + 'px');
        confettiContainer.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 2000);
      }, i * 40);
    }
  },
  
  // Update home page UI with current companion state
  updateHomeUI() {
    const companionType = AppStorage.getCompanionType();
    const streakDays = AppStorage.getCurrentStreak();
    const companionName = AppStorage.getCompanionName();
    
    // Get current state
    const currentState = this.getCurrentState(companionType, streakDays);
    
    // Update emoji
    const emojiElement = document.getElementById('companion-emoji');
    if (emojiElement) {
      if (currentState.emoji === 'phoenix') {
        // Use SVG for phoenix
        emojiElement.innerHTML = '<img src="/assets/phoenix.svg" alt="Fenice" style="width: 100px; height: 100px; filter: drop-shadow(0 4px 8px rgba(255, 140, 0, 0.5));" class="phoenix-svg">';
      } else {
        emojiElement.textContent = currentState.emoji;
        emojiElement.innerHTML = currentState.emoji; // Reset if was SVG before
      }
    }
    
    // Update name display
    const nameElement = document.getElementById('companion-display-name');
    if (nameElement) {
      const displayEmoji = currentState.emoji === 'phoenix' ? '🔥' : currentState.emoji;
      nameElement.textContent = `${displayEmoji} ${companionName}`;
    }
    
    // Update streak counter
    const counterElement = document.getElementById('streak-counter');
    if (counterElement) {
      const daysText = streakDays === 1 ? 'giorno pulito' : 'giorni pulito';
      counterElement.textContent = `🔥 ${streakDays} ${daysText}`;
    }
    
    // Update evolution text
    const evolutionElement = document.getElementById('evolution-text');
    if (evolutionElement) {
      evolutionElement.textContent = this.getEvolutionMessage(companionType, streakDays);
    }
  },
  
  // Get greeting based on time of day
  getGreeting() {
    const hour = new Date().getHours();
    
    if (hour < 12) return '☀️ Buongiorno!';
    if (hour < 18) return '👋 Buon pomeriggio!';
    return '🌙 Buonasera!';
  },
  
  // Update greeting in check-in section
  updateGreeting() {
    const greetingElement = document.getElementById('checkin-greeting');
    if (greetingElement) {
      greetingElement.textContent = this.getGreeting();
    }
  }
};

// Make available globally
window.Companion = Companion;
