/* ================================
   STREAK GUARDIAN - MAIN APP
   Application logic and event handlers
   ================================ */

// Global state
let currentOnboardingStep = 1;
let selectedCompanionType = null;
let selectedAddictionType = null;
let customAddictionName = null;

// Initialize app on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  initializeDarkMode();
  initializeSounds();
});

// Main initialization
function initializeApp() {
  console.log('🚀 Streak Guardian initializing...');
  
  // Check if onboarding is complete
  if (AppStorage.isOnboardingComplete()) {
    showApp();
  } else {
    showOnboarding();
  }
}

// Dark Mode Management
function initializeDarkMode() {
  const savedTheme = Storage.get(STORAGE_KEYS.THEME, 'auto');
  applyTheme(savedTheme);
  updateDarkModeUI();
  
  // Check time every minute for auto mode
  setInterval(() => {
    const theme = Storage.get(STORAGE_KEYS.THEME, 'auto');
    if (theme === 'auto') {
      applyTheme('auto');
    }
  }, 60000); // Check every minute
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode-forced');
  } else if (theme === 'light') {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode-forced');
  } else {
    // Auto mode - check time
    const hour = new Date().getHours();
    const isDarkTime = hour >= 20 || hour < 7;
    
    if (isDarkTime) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    document.body.classList.remove('light-mode-forced');
  }
}

function toggleDarkMode() {
  const currentTheme = Storage.get(STORAGE_KEYS.THEME, 'auto');
  let newTheme;
  
  if (currentTheme === 'auto') {
    // Auto -> Light
    newTheme = 'light';
  } else if (currentTheme === 'light') {
    // Light -> Dark
    newTheme = 'dark';
  } else {
    // Dark -> Auto
    newTheme = 'auto';
  }
  
  Storage.set(STORAGE_KEYS.THEME, newTheme);
  applyTheme(newTheme);
  updateDarkModeUI();
  
  showToast(`Tema: ${newTheme === 'auto' ? 'Automatico' : newTheme === 'dark' ? 'Scuro' : 'Chiaro'}`, 'info');
}

function updateDarkModeUI() {
  const theme = Storage.get(STORAGE_KEYS.THEME, 'auto');
  const label = document.getElementById('dark-mode-label');
  const switchEl = document.getElementById('dark-mode-switch');
  const indicator = document.getElementById('auto-mode-indicator');
  
  if (!label || !switchEl || !indicator) return;
  
  if (theme === 'auto') {
    label.textContent = 'Automatica';
    switchEl.classList.remove('active');
    indicator.style.display = 'block';
  } else if (theme === 'light') {
    label.textContent = 'Chiara';
    switchEl.classList.remove('active');
    indicator.style.display = 'none';
  } else {
    label.textContent = 'Scura';
    switchEl.classList.add('active');
    indicator.style.display = 'none';
  }
}

// Sounds Management
function initializeSounds() {
  updateSoundsUI();
}

function toggleSounds() {
  const current = Storage.get(STORAGE_KEYS.SOUNDS_ENABLED, false);
  const newValue = !current;
  
  Storage.set(STORAGE_KEYS.SOUNDS_ENABLED, newValue);
  updateSoundsUI();
  
  showToast(`Suoni: ${newValue ? 'Attivati' : 'Disattivati'}`, 'info');
  
  // Play test sound if enabled
  if (newValue) {
    playSound('success');
  }
}

function updateSoundsUI() {
  const enabled = Storage.get(STORAGE_KEYS.SOUNDS_ENABLED, false);
  const label = document.getElementById('sounds-label');
  const switchEl = document.getElementById('sounds-switch');
  
  if (!label || !switchEl) return;
  
  label.textContent = enabled ? 'Attivati' : 'Disattivati';
  
  if (enabled) {
    switchEl.classList.add('active');
  } else {
    switchEl.classList.remove('active');
  }
}

function playSound(type) {
  const enabled = Storage.get(STORAGE_KEYS.SOUNDS_ENABLED, false);
  if (!enabled) return;
  
  // Use Web Audio API for simple sounds
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  if (type === 'success') {
    // Happy ascending notes
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
  } else if (type === 'evolution') {
    // Celebration sound
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime); // G5
    oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime + 0.15); // C6
  }
  
  oscillator.type = 'sine';
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}

// Show onboarding flow
function showOnboarding() {
  document.getElementById('onboarding-container').style.display = 'block';
  document.getElementById('app-container').style.display = 'none';
  
  // Start at step 1
  showOnboardingStep(1);
}

// Show specific onboarding step
function showOnboardingStep(step) {
  // Hide all steps
  for (let i = 1; i <= 4; i++) {
    const stepElement = document.getElementById(`onboarding-step-${i}`);
    if (stepElement) {
      stepElement.style.display = 'none';
    }
  }
  
  // Show current step
  const currentStep = document.getElementById(`onboarding-step-${step}`);
  if (currentStep) {
    currentStep.style.display = 'flex';
    currentOnboardingStep = step;
  }
}

// Navigate to next onboarding step
function nextOnboardingStep(step) {
  showOnboardingStep(step);
}

// Select addiction
function selectAddiction(type) {
  selectedAddictionType = type;
  nextOnboardingStep(3);
}

// Custom addiction prompt
function customAddiction() {
  const customName = prompt('Scrivi il nome della dipendenza che vuoi affrontare:');
  if (customName && customName.trim()) {
    selectedAddictionType = 'custom';
    customAddictionName = customName.trim();
    nextOnboardingStep(3);
  }
}

// Select companion
function selectCompanion(type) {
  selectedCompanionType = type;
  nextOnboardingStep(4);
}

// Complete onboarding
function completeOnboarding() {
  const nameInput = document.getElementById('companion-name-input');
  const companionName = nameInput.value.trim();
  
  if (!companionName) {
    showToast('Per favore, dai un nome al tuo compagno!', 'error');
    nameInput.focus();
    return;
  }
  
  if (!selectedCompanionType || !selectedAddictionType) {
    showToast('Errore: dati mancanti. Riprova.', 'error');
    return;
  }
  
  // Save onboarding data
  AppStorage.completeOnboarding({
    companionType: selectedCompanionType,
    companionName: companionName,
    addictionType: selectedAddictionType,
    addictionCustom: customAddictionName
  });
  
  // Show success and transition to app
  showToast('🎉 Benvenuto! Il tuo viaggio inizia ora!', 'success');
  
  setTimeout(() => {
    showApp();
  }, 1000);
}

// Show main app
function showApp() {
  document.getElementById('onboarding-container').style.display = 'none';
  document.getElementById('app-container').style.display = 'block';
  
  // Initialize home page
  navigateTo('home');
  
  // Update UI
  updateHomeUI();
  
  // Check if should show evolution celebration
  checkAndShowEvolution();
}

// Navigation between pages
function navigateTo(page) {
  // Hide all pages
  const pages = ['home-page', 'stats-page', 'settings-page'];
  pages.forEach(pageId => {
    const element = document.getElementById(pageId);
    if (element) {
      element.style.display = 'none';
    }
  });
  
  // Show selected page
  const selectedPage = document.getElementById(`${page}-page`);
  if (selectedPage) {
    selectedPage.style.display = 'block';
  }
  
  // Update bottom nav active state
  const navItems = document.querySelectorAll('.bottom-nav-item');
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-page') === page) {
      item.classList.add('active');
    }
  });
  
  // Update page-specific content
  if (page === 'home') {
    updateHomeUI();
  } else if (page === 'stats') {
    Stats.updateStatsPage();
  } else if (page === 'settings') {
    updateSettingsUI();
  }
}

// Update home page UI
function updateHomeUI() {
  // Update companion display
  Companion.updateHomeUI();
  
  // Update greeting
  Companion.updateGreeting();
  
  // Check if user has checked in today
  const hasCheckedIn = AppStorage.hasCheckedInToday();
  
  const checkinSection = document.getElementById('checkin-section');
  const alreadyCheckedin = document.getElementById('already-checkedin');
  
  if (hasCheckedIn) {
    // Show "already checked in" message
    if (checkinSection) checkinSection.style.display = 'none';
    if (alreadyCheckedin) alreadyCheckedin.style.display = 'block';
  } else {
    // Show check-in buttons
    if (checkinSection) checkinSection.style.display = 'block';
    if (alreadyCheckedin) alreadyCheckedin.style.display = 'none';
  }
}

// Check-in success
function checkInSuccess() {
  const newStreak = AppStorage.checkIn();
  const companionType = AppStorage.getCompanionType();
  
  // Play success sound
  playSound('success');
  
  // Get personalized message
  const message = Companion.getPersonalizedMessage(companionType, 'checkin');
  
  // Show toast with personalized message
  showToast(`🎉 Giorno ${newStreak}! ${message}`, 'success');
  
  // Update UI
  updateHomeUI();
  
  // Add animation to streak counter
  const counter = document.getElementById('streak-counter');
  if (counter) {
    counter.classList.add('updated');
    setTimeout(() => counter.classList.remove('updated'), 300);
  }
  
  // Check if should show evolution
  const evolutionMilestone = Companion.shouldShowEvolution(newStreak);
  if (evolutionMilestone) {
    setTimeout(() => {
      Companion.showEvolutionCelebration(evolutionMilestone);
      playSound('evolution');
    }, 1000);
  }
  
  // Optional: Vibrate
  if (navigator.vibrate) {
    navigator.vibrate(100);
  }
}

// Check-in failed (relapse)
function checkInFailed() {
  // Show confirmation dialog
  const confirmed = confirm(
    '⚠️ Sei sicuro?\n\n' +
    'Questo resetterà la tua streak.\n\n' +
    'Se è stata solo una piccola scivolata, puoi chiudere questo messaggio e continuare.'
  );
  
  if (!confirmed) return;
  
  // Double confirmation
  const doubleConfirmed = confirm(
    '⚠️ Ultima conferma\n\n' +
    'Confermi di voler resettare la streak a 0?\n\n' +
    'Questa azione non può essere annullata.'
  );
  
  if (!doubleConfirmed) return;
  
  // Get companion type for personalized message
  const companionType = AppStorage.getCompanionType();
  
  // Reset streak
  AppStorage.resetStreak();
  
  // Show supportive personalized message
  const message = Companion.getPersonalizedMessage(companionType, 'reset');
  showToast(message, 'info');
  
  // Update UI
  updateHomeUI();
}

// Check and show evolution if needed
function checkAndShowEvolution() {
  const streakDays = AppStorage.getCurrentStreak();
  const evolutionMilestone = Companion.shouldShowEvolution(streakDays);
  
  if (evolutionMilestone) {
    setTimeout(() => {
      Companion.showEvolutionCelebration(evolutionMilestone);
    }, 500);
  }
}

// Close evolution overlay
function closeEvolution() {
  document.getElementById('evolution-overlay').style.display = 'none';
}

// SOS Functions
function openSOS() {
  document.getElementById('sos-overlay').style.display = 'flex';
}

function closeSOS() {
  document.getElementById('sos-overlay').style.display = 'none';
  
  // Increment SOS count
  AppStorage.incrementSOSCount();
  
  // Show toast
  showToast('💪 Momento difficile superato!', 'success');
}

function sosCallFriend() {
  alert(
    '📱 Chiama un amico\n\n' +
    'Esci dall\'app e chiama qualcuno che ti vuole bene.\n\n' +
    'Parlare con una persona cara può fare la differenza.'
  );
  closeSOS();
}

function sosWalk() {
  document.getElementById('sos-overlay').style.display = 'none';
  
  // Show walking message overlay
  alert(
    '🚶 Esci a camminare\n\n' +
    'Cambia ambiente. Esci dalla stanza.\n\n' +
    'Fai 10 respiri profondi all\'aperto.\n\n' +
    'Torna tra 10 minuti. ' + AppStorage.getCompanionName() + ' ti aspetta qui. 💚'
  );
  
  AppStorage.incrementSOSCount();
  showToast('Buona camminata! Ci vediamo tra poco 🌳', 'success');
}

function sosWrite() {
  const note = prompt(
    '✍️ Scrivi cosa senti\n\n' +
    'Nessuno lo leggerà. È solo per te.\n\n' +
    'Scrivi tutto quello che vorresti urlare:'
  );
  
  if (note && note.trim()) {
    AppStorage.saveCravingNote(note.trim());
    showToast('Nota salvata. Hai fatto bene a scriverlo. 💚', 'success');
  }
  
  closeSOS();
}

function sosTimer() {
  // Simple timer implementation
  const confirmed = confirm(
    '⏱️ Timer 5 minuti\n\n' +
    'Prenditi 5 minuti per respirare.\n\n' +
    'Inspira 4 secondi.\n' +
    'Trattieni 2 secondi.\n' +
    'Espira 6 secondi.\n\n' +
    'Premi OK per iniziare.'
  );
  
  if (confirmed) {
    document.getElementById('sos-overlay').style.display = 'none';
    
    let timeLeft = 300; // 5 minutes in seconds
    
    const timer = setInterval(() => {
      timeLeft--;
      
      if (timeLeft <= 0) {
        clearInterval(timer);
        showToast('⏱️ 5 minuti completati! Ce l\'hai fatta! 💪', 'success');
        AppStorage.incrementSOSCount();
      }
    }, 1000);
    
    showToast('⏱️ Timer iniziato. Respira profondamente...', 'info');
  }
}

// Settings Functions
function updateSettingsUI() {
  // Update companion name input
  const nameInput = document.getElementById('companion-name-setting');
  if (nameInput) {
    nameInput.value = AppStorage.getCompanionName();
  }
  
  // Update daily cost input
  const costInput = document.getElementById('daily-cost-setting');
  if (costInput) {
    const cost = AppStorage.getDailyCost();
    costInput.value = cost > 0 ? cost : '';
  }
  
  // Update addiction name display
  const addictionDisplay = document.getElementById('addiction-name-display');
  if (addictionDisplay) {
    addictionDisplay.textContent = AppStorage.getAddictionName();
  }
  
  // Update dark mode UI
  updateDarkModeUI();
  
  // Update sounds UI
  updateSoundsUI();
}

function saveCompanionName() {
  const nameInput = document.getElementById('companion-name-setting');
  const newName = nameInput.value.trim();
  
  if (!newName) {
    showToast('Il nome non può essere vuoto!', 'error');
    return;
  }
  
  AppStorage.setCompanionName(newName);
  showToast('✅ Nome salvato!', 'success');
  
  // Update home UI if visible
  updateHomeUI();
}

function changeCompanion() {
  const confirmed = confirm(
    '⚠️ Cambiare compagno?\n\n' +
    'Questo cambierà l\'aspetto del tuo compagno ma manterrà la tua streak.\n\n' +
    'Confermi?'
  );
  
  if (!confirmed) return;
  
  const currentType = AppStorage.getCompanionType();
  const types = ['plant', 'animal', 'flame'];
  const typeNames = {
    plant: 'Pianta 🌱',
    animal: 'Animale 🥚',
    flame: 'Fiamma 🔥'
  };
  
  let choice = prompt(
    'Scegli il nuovo compagno:\n\n' +
    '1 - Pianta 🌱\n' +
    '2 - Animale 🥚\n' +
    '3 - Fiamma 🔥\n\n' +
    'Digita il numero:'
  );
  
  if (choice === '1') {
    AppStorage.setCompanionType('plant');
    showToast('✅ Compagno cambiato in Pianta!', 'success');
  } else if (choice === '2') {
    AppStorage.setCompanionType('animal');
    showToast('✅ Compagno cambiato in Animale!', 'success');
  } else if (choice === '3') {
    AppStorage.setCompanionType('flame');
    showToast('✅ Compagno cambiato in Fiamma!', 'success');
  } else {
    showToast('Scelta non valida', 'error');
    return;
  }
  
  updateHomeUI();
}

function changeAddiction() {
  const confirmed = confirm(
    '⚠️ Cambiare dipendenza?\n\n' +
    'Vuoi tracciare una dipendenza diversa?\n' +
    'La tua streak attuale continuerà.\n\n' +
    'Confermi?'
  );
  
  if (!confirmed) return;
  
  const newAddiction = prompt(
    'Scrivi il nome della nuova dipendenza da affrontare:'
  );
  
  if (newAddiction && newAddiction.trim()) {
    AppStorage.setAddictionType('custom', newAddiction.trim());
    showToast('✅ Dipendenza aggiornata!', 'success');
    updateSettingsUI();
  }
}

function saveDailyCost() {
  const costInput = document.getElementById('daily-cost-setting');
  const cost = parseFloat(costInput.value);
  
  if (isNaN(cost) || cost < 0) {
    showToast('Inserisci un valore valido', 'error');
    return;
  }
  
  AppStorage.setDailyCost(cost);
  showToast('💰 Salvadanaio attivato!', 'success');
  
  // Update stats if visible
  Stats.updateStatsPage();
}

function exportData() {
  const data = AppStorage.exportUserData();
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `streak-guardian-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
  
  showToast('✅ Dati esportati!', 'success');
}

function resetAll() {
  const confirmed = confirm(
    '⚠️ ATTENZIONE\n\n' +
    'Stai per eliminare TUTTI i dati:\n' +
    '- Streak corrente\n' +
    '- Storico check-in\n' +
    '- Impostazioni\n' +
    '- Tutto\n\n' +
    'Questa azione NON può essere annullata!\n\n' +
    'Sei SICURO?'
  );
  
  if (!confirmed) return;
  
  const doubleConfirmed = confirm(
    '⚠️ ULTIMA CONFERMA\n\n' +
    'Confermi di voler eliminare TUTTO?\n\n' +
    'Non potrai recuperare i dati!'
  );
  
  if (!doubleConfirmed) return;
  
  // Reset everything
  AppStorage.resetAll();
  
  showToast('Tutti i dati sono stati eliminati', 'info');
  
  // Reload app
  setTimeout(() => {
    location.reload();
  }, 1000);
}

function showPrivacy() {
  alert(
    '🔒 Privacy & Dati\n\n' +
    'DOVE SONO I TUOI DATI?\n' +
    'Tutti i tuoi dati sono salvati SOLO sul tuo dispositivo (localStorage del browser).\n\n' +
    '❌ NOI NON RACCOGLIAMO:\n' +
    '• Nessuna informazione personale\n' +
    '• Nessuna analisi di utilizzo\n' +
    '• Nessun dato di navigazione\n' +
    '• Nessun tracking\n\n' +
    '✅ I TUOI DATI INCLUDONO:\n' +
    '• Streak corrente\n' +
    '• Nome del compagno\n' +
    '• Tipo di dipendenza\n' +
    '• Storico check-in\n\n' +
    '⚠️ COSA SIGNIFICA:\n' +
    '✓ La tua privacy è TOTALE\n' +
    '✗ Se cancelli dati browser, perdi tutto\n' +
    '✗ Se cambi dispositivo, non puoi sincronizzare\n\n' +
    'Questa scelta è intenzionale: preferiamo la tua privacy assoluta alla comodità.'
  );
}

// Toast notification system
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  }[type] || 'ℹ️';
  
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  
  container.appendChild(toast);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Utility: Format date
function formatDate(date) {
  return date.toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

// Utility: Get today's date string
function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

// Handle visibility change (app comes back to foreground)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && AppStorage.isOnboardingComplete()) {
    // App became visible, refresh UI
    updateHomeUI();
    checkAndShowEvolution();
  }
});

// Service Worker registration (for PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('✅ Service Worker registered');
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

// Make functions globally available
window.nextOnboardingStep = nextOnboardingStep;
window.selectAddiction = selectAddiction;
window.customAddiction = customAddiction;
window.selectCompanion = selectCompanion;
window.completeOnboarding = completeOnboarding;
window.navigateTo = navigateTo;
window.checkInSuccess = checkInSuccess;
window.checkInFailed = checkInFailed;
window.closeEvolution = closeEvolution;
window.openSOS = openSOS;
window.closeSOS = closeSOS;
window.sosCallFriend = sosCallFriend;
window.sosWalk = sosWalk;
window.sosWrite = sosWrite;
window.sosTimer = sosTimer;
window.saveCompanionName = saveCompanionName;
window.changeCompanion = changeCompanion;
window.changeAddiction = changeAddiction;
window.saveDailyCost = saveDailyCost;
window.exportData = exportData;
window.resetAll = resetAll;
window.showPrivacy = showPrivacy;
window.showToast = showToast;
window.toggleDarkMode = toggleDarkMode;
window.toggleSounds = toggleSounds;
window.playSound = playSound;

console.log('✅ Streak Guardian loaded successfully!');
