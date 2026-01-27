/* ================================
   STREAK GUARDIAN - COMPANION
   Companion evolution and display logic
   ================================ */

const Companion = {
  
  // Evolution thresholds for each companion type
  MILESTONES: {
    plant: [
      { days: 0, path: '/assets/companions/plant-stage1.svg', name: 'Germoglio' },
      { days: 7, path: '/assets/companions/plant-stage2.svg', name: 'Piantina' },
      { days: 30, path: '/assets/companions/plant-stage3.svg', name: 'Albero' }
    ],
    cat: [
      { days: 0, path: '/assets/companions/egg.svg', name: 'Uovo Misterioso' },
      { days: 7, path: '/assets/companions/cat-stage2.svg', name: 'Gattino' },
      { days: 30, path: '/assets/companions/cat-stage3.svg', name: 'Gatto' }
    ],
    dog: [
      { days: 0, path: '/assets/companions/egg.svg', name: 'Uovo Misterioso' },
      { days: 7, path: '/assets/companions/dog-stage2.svg', name: 'Cucciolo' },
      { days: 30, path: '/assets/companions/dog-stage3.svg', name: 'Cane' }
    ],
    bird: [
      { days: 0, path: '/assets/companions/egg.svg', name: 'Uovo Misterioso' },
      { days: 7, path: '/assets/companions/bird-stage2.svg', name: 'Pulcino' },
      { days: 30, path: '/assets/companions/bird-stage3.svg', name: 'Uccello' }
    ],
    dragon: [
      { days: 0, path: '/assets/companions/egg.svg', name: 'Uovo Misterioso' },
      { days: 7, path: '/assets/companions/dragon-stage2.svg', name: 'Draghetto' },
      { days: 30, path: '/assets/companions/dragon-stage3.svg', name: 'Drago' }
    ],
    flame: [
      { days: 0, path: '/assets/companions/flame-stage1.svg', name: 'Scintilla' },
      { days: 7, path: '/assets/companions/flame-stage2.svg', name: 'Fiamma' },
      { days: 30, path: '/assets/companions/flame-stage3.svg', name: 'Stella Cadente' }
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
        cat: 'Il tuo gatto è cresciuto! Fiero e indipendente! 🐈',
        dog: 'Il tuo cane è fedele e forte! Siete una squadra! 🐕',
        bird: 'Il tuo uccello vola libero! Guardalo planare! 🦅',
        dragon: 'Il tuo drago è leggendario! Potenza assoluta! 🐉',
        flame: 'Sei una stella cadente! Inarrestabile! ⭐'
      };
      return messages[companionType] || 'Continua così! 💪';
    }
    
    const daysUntil = nextMilestone.days - streakDays;
    
    // Different messages based on companion type
    const messages = {
      plant: {
        7: `Tra ${daysUntil} ${daysUntil === 1 ? 'giorno' : 'giorni'} diventerà una piantina`,
        30: `Tra ${daysUntil} ${daysUntil === 1 ? 'giorno' : 'giorni'} sarà un albero maestoso`
      },
      cat: {
        7: `Tra ${daysUntil} ${daysUntil === 1 ? 'giorno' : 'giorni'} l'uovo si schiuderà`,
        30: `Tra ${daysUntil} ${daysUntil === 1 ? 'giorno' : 'giorni'} il gattino crescerà`
      },
      dog: {
        7: `Tra ${daysUntil} ${daysUntil === 1 ? 'giorno' : 'giorni'} l'uovo si schiuderà`,
        30: `Tra ${daysUntil} ${daysUntil === 1 ? 'giorno' : 'giorni'} il cucciolo crescerà`
      },
      bird: {
        7: `Tra ${daysUntil} ${daysUntil === 1 ? 'giorno' : 'giorni'} l'uovo si schiuderà`,
        30: `Tra ${daysUntil} ${daysUntil === 1 ? 'giorno' : 'giorni'} il pulcino volerà`
      },
      dragon: {
        7: `Tra ${daysUntil} ${daysUntil === 1 ? 'giorno' : 'giorni'} l'uovo si schiuderà`,
        30: `Tra ${daysUntil} ${daysUntil === 1 ? 'giorno' : 'giorni'} il draghetto crescerà`
      },
      flame: {
        7: `Tra ${daysUntil} ${daysUntil === 1 ? 'giorno' : 'giorni'} diventerà una fiamma`,
        30: `Tra ${daysUntil} ${daysUntil === 1 ? 'giorno' : 'giorni'} diventerà una stella`
      }
    };
    
    return messages[companionType]?.[nextMilestone.days] || 
           `Tra ${daysUntil} ${daysUntil === 1 ? 'giorno' : 'giorni'} evolverà!`;
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
      cat: {
        general: `${companionName} ti osserva con fiducia. Indipendente ma sempre al tuo fianco.`,
        sos: `${companionName} si avvicina silenziosamente. I gatti sentono quando hai bisogno di loro. Sei al sicuro.`,
        evolution: `${companionName} è cresciuto con eleganza! Fiero e indipendente! 🐈`,
        reset: `${companionName} ti guarda senza giudicare. I gatti sanno che cadere fa parte del viaggio. Rialzati.`,
        milestone: `${companionName} fa le fusa! È incredibilmente fiero di te! 🐱`,
        checkin: `${companionName} allunga le zampe! Un altro giorno insieme! 🐈`
      },
      dog: {
        general: `${companionName} conta su di te, e tu non sei mai solo in questo viaggio. Siete una squadra.`,
        sos: `${companionName} sente che hai bisogno di supporto. Non sei solo. Siete una squadra e supererete questo momento insieme.`,
        evolution: `${companionName} è cresciuto al tuo fianco! State diventando più forti insieme! 🐕`,
        reset: `${companionName} non ti abbandona mai. I veri compagni restano anche quando cadi. Rialzati, c'è qualcuno che crede in te. 💙`,
        milestone: `${companionName} scodinzola felice! È incredibilmente fiero di te! 🐶`,
        checkin: `${companionName} gioisce! Un altro giorno insieme, un passo avanti! 🐕`
      },
      bird: {
        general: `${companionName} ti guarda dall'alto. Libero, ma sempre torna da te.`,
        sos: `${companionName} canta una melodia tranquilla. Anche le tempeste passano. Respira.`,
        evolution: `${companionName} ha spiegato le ali! Guarda quanto è cresciuto! 🦅`,
        reset: `${companionName} è caduto dal nido, ma ha imparato a volare. Anche tu puoi rialzarti.`,
        milestone: `${companionName} vola in cerchio! Celebra con te questa vittoria! 🐦`,
        checkin: `${companionName} cinguetta felice! Un altro volo insieme! 🦜`
      },
      dragon: {
        general: `${companionName} ti protegge con potenza antica. Un guardiano leggendario.`,
        sos: `${companionName} soffia fiamme difensive. Nessuno ti toccherà. Sei al sicuro.`,
        evolution: `${companionName} ha dispiegato le ali! Potenza leggendaria! 🐉`,
        reset: `Anche ${companionName} è nato dal fuoco. Le leggende iniziano dalle ceneri. Riparti.`,
        milestone: `${companionName} ruggisce! La tua forza è leggendaria! 🐲`,
        checkin: `${companionName} soffia fiamme di gioia! Avanti così! 🔥`
      },
      flame: {
        general: `Ogni giorno ${companionName} brucia più forte. La tua fiamma interiore è potente e nulla può spegnerla.`,
        sos: `${companionName} ti ricorda: anche nei momenti di oscurità, la tua luce può tornare. Sei più forte del desiderio.`,
        evolution: `${companionName} arde con intensità rinnovata! Sei un fuoco che non può essere spento! 🔥`,
        reset: `Come ${companionName}, puoi rinascere dalle ceneri. La stella cade per brillare più forte. Questa non è la fine. ⭐`,
        milestone: `${companionName} brucia luminoso come mai prima! Sei una forza inarrestabile della natura! ✨`,
        checkin: `${companionName} divampa! La tua fiamma brucia sempre più forte! 🔥`
      }
    };
    
    return messages[companionType]?.[context] || `${companionName} è con te! 💚`;
  },
  
  // Check if it's time to show evolution celebration
  shouldShowEvolution(streakDays) {
    const milestones = [7, 30];
    
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
    
    // Update overlay content with SVG images
    const oldEmojiEl = document.getElementById('old-emoji');
    const newEmojiEl = document.getElementById('new-emoji');
    
    if (oldEmojiEl) {
      oldEmojiEl.innerHTML = `<img src="${oldState.path}" alt="${oldState.name}" style="width: 60px; height: 60px;">`;
    }
    
    if (newEmojiEl) {
      newEmojiEl.innerHTML = `<img src="${newState.path}" alt="${newState.name}" style="width: 80px; height: 80px;">`;
    }
    
    const messages = {
      7: `${companionName} è evoluto!`,
      30: `${companionName} ha raggiunto la sua forma finale!`
    };
    
    document.getElementById('evolution-message').textContent = 
      messages[milestone] || `${companionName} è cresciuto!`;
    
    const submessages = {
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
    
    // Update companion display with SVG
    const emojiElement = document.getElementById('companion-emoji');
    if (emojiElement) {
      emojiElement.innerHTML = `<img src="${currentState.path}" alt="${currentState.name}" style="width: 120px; height: 120px;" class="companion-svg">`;
    }
    
    // Update name display (just text, no emoji needed)
    const nameElement = document.getElementById('companion-display-name');
    if (nameElement) {
      nameElement.textContent = companionName;
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
