# 📝 NOTE TECNICHE - STREAK GUARDIAN

## Tecnologie Utilizzate

### Frontend
- **HTML5**: Struttura semantica
- **CSS3**: Styling con variabili CSS, Flexbox, Grid
- **JavaScript ES6+**: Logica applicativa
- **LocalStorage API**: Persistenza dati
- **Service Worker**: Funzionalità offline (PWA)

### Design System
- **Font**: Nunito (headings), Inter (body), DM Sans (numbers)
- **Colori**: Verde primario (#10B981), palette calda
- **Animazioni**: 60fps con CSS animations e transitions
- **Responsive**: Mobile-first, breakpoint 768px

### Deployment
- **Vercel**: Hosting statico con CDN globale
- **GitHub**: Version control
- **PWA**: Manifest + Service Worker

---

## Architettura Codice

### Pattern Utilizzati
- **Module Pattern**: Ogni file JS espone oggetti globali (Storage, Companion, Stats, ecc.)
- **Event-Driven**: Listener per visibilitychange, DOMContentLoaded
- **Progressive Enhancement**: Funziona anche senza JS (HTML statico)

### File Organization
```
index.html          → Single Page Application (SPA)
├── css/
│   ├── main.css    → Layout, componenti, utilities
│   └── animations  → Keyframes, transitions
└── js/
    ├── storage.js  → Data layer (localStorage wrapper)
    ├── companion.js→ Business logic (evolution, messages)
    ├── stats.js    → Calculations, rendering
    └── app.js      → UI logic, event handlers
```

---

## Data Model (localStorage)

### Keys Utilizzati
```javascript
{
  // Onboarding
  onboardingCompleted: boolean,
  
  // User Config
  companionType: 'plant' | 'animal' | 'flame',
  companionName: string,
  addictionType: string,
  addictionCustom: string | null,
  
  // Streak Data
  startDate: ISO8601 string,
  streakDays: number,
  longestStreak: number,
  lastCheckInDate: 'YYYY-MM-DD',
  
  // History
  dailyCheckIns: string[],      // ['2025-01-15', '2025-01-16', ...]
  failedDates: string[],
  streakHistory: object[],      // [{startDate, endDate, days}, ...]
  
  // SOS
  sosEventsCount: number,
  sosHistory: object[],         // [{date, trigger}, ...]
  cravingNotes: object[],       // [{date, note}, ...]
  
  // Settings
  dailyCost: number,
  evolutionsSeen: number[]      // [3, 7, 30]
}
```

### Data Flow
1. **User Action** → UI Event
2. **Event Handler** (app.js) → Validates input
3. **Storage Layer** (storage.js) → Saves to localStorage
4. **Business Logic** (companion.js, stats.js) → Calculations
5. **UI Update** → DOM manipulation

---

## Componenti Principali

### 1. Onboarding Flow
- **States**: 4 steps (Welcome → Addiction → Companion → Name)
- **Validation**: Nome non vuoto, scelte obbligatorie
- **Persistenza**: Salva tutto in un'unica operazione

### 2. Check-In System
- **Frequency**: Una volta al giorno
- **Detection**: Confronto lastCheckInDate con today
- **Actions**: 
  - Success → Incrementa streak, aggiorna UI, check evolution
  - Failed → Doppia conferma, reset streak, messaggio supportivo

### 3. Companion Evolution
- **Thresholds**: Giorni 0, 3, 7, 30
- **States**: 4 per tipo (totale 12 combinazioni)
- **Celebration**: Fullscreen overlay con confetti (solo prima volta per milestone)

### 4. SOS System
- **Trigger**: Pulsante sempre visibile in home
- **Options**: 4 azioni concrete (call, walk, write, timer)
- **Tracking**: Incrementa counter, salva in history

### 5. Stats Display
- **Calendar**: Griglia 7x5 (35 giorni) con ultimi 30 evidenziati
- **Calculations**: Real-time da localStorage
- **Savings**: Solo se dailyCost > 0

---

## Performance Optimizations

### CSS
- **CSS Variables**: Evita duplicazione, facile theming
- **Hardware Acceleration**: `transform: translateZ(0)` per animazioni
- **Will-change**: Hint al browser per preparare animazioni
- **Reduced Motion**: Media query per accessibilità

### JavaScript
- **Event Delegation**: Listener su parent invece che su ogni elemento
- **Lazy Loading**: Pagine Stats/Settings solo quando visitate
- **Debouncing**: Non implementato (non necessario per questa app)
- **LocalStorage Cache**: Accesso minimo, cache in variabili quando possibile

### Animazioni
- **CSS Animations**: Preferite a JS per 60fps garantiti
- **Cubic Beziers**: Easing naturali per movimento fluido
- **GPU Layers**: Transform e opacity invece di top/left

---

## Browser Compatibility

### Supporto Minimo
- **Chrome**: 90+
- **Safari**: 14+
- **Firefox**: 88+
- **Edge**: 90+

### Fallback
- **No LocalStorage**: Alert "Browser non supportato"
- **No Service Worker**: App funziona comunque (solo no offline)
- **No CSS Grid**: Fallback a Flexbox (già implementato)

### Testing Checklist
- [ ] Chrome Desktop (ultima versione)
- [ ] Safari iOS (iPhone)
- [ ] Chrome Android
- [ ] Firefox Desktop
- [ ] Edge Desktop

---

## Security Considerations

### Implementate
- **Content Security**: Headers Vercel (X-Frame-Options, etc.)
- **XSS Protection**: No `innerHTML` con dati utente, solo `textContent`
- **Data Sanitization**: `.trim()` su tutti gli input
- **No Eval**: Nessun uso di `eval()` o `Function()`

### Limitazioni Note
- **LocalStorage**: Non crittografato (OK per questa use case)
- **No Authentication**: App single-user, no backend
- **Client-Side Only**: Tutto visibile in DevTools (intenzionale)

---

## Accessibility (a11y)

### Implementato
- **Keyboard Navigation**: Tutti i pulsanti accessibili via Tab
- **Focus States**: Outline visibile su :focus-visible
- **Color Contrast**: WCAG AA compliant (4.5:1 minimum)
- **Reduced Motion**: Media query disabilita animazioni se richiesto
- **Font Size**: Minimo 16px (no zoom iOS)

### Da Migliorare (future)
- [ ] ARIA labels su elementi interattivi
- [ ] Screen reader testing
- [ ] High contrast mode support
- [ ] Focus trap in modals

---

## Known Limitations

### Tecnici
1. **No Sync**: Dati non sincronizzati tra dispositivi
2. **No Backup Cloud**: Dati persi se localStorage cancellato
3. **No Notifiche Push**: Solo promemoria in-app
4. **Single User**: Un solo profilo per browser

### Design
1. **Emoji Dependency**: Su alcuni OS emoji potrebbero apparire diversamente
2. **No Dark Mode Auto**: Utente deve scegliere (future feature)
3. **No Themes**: Un solo color scheme (verde)

### Funzionali
1. **No Undo**: Reset è permanente
2. **No Multi-Addiction**: Traccia una dipendenza alla volta
3. **No Community**: Nessuna funzione sociale (intenzionale per privacy)

---

## Future Enhancements

### Priorità Alta
- [ ] Export/Import dati per backup
- [ ] Notifiche push (se PWA installata)
- [ ] Widget per Android/iOS home screen
- [ ] Supporto multi-lingua (EN, ES, FR)

### Priorità Media
- [ ] Dark mode automatico
- [ ] Temi alternativi (colori)
- [ ] Suoni feedback (opzionali)
- [ ] Grafici avanzati (trend, pattern)

### Priorità Bassa
- [ ] Sync cloud opzionale (E2E encrypted)
- [ ] Community anonima (messaggi supporto)
- [ ] AI chatbot per SOS (integrazione Claude API)
- [ ] Gamification avanzata (achievements, livelli)

---

## Testing Strategy

### Manual Testing
1. **Happy Path**: Onboarding → Check-in → Evolution → Stats
2. **Edge Cases**: 
   - Check-in multipli stesso giorno (dovrebbe ignorare)
   - Reset a streak 0
   - Cambio compagno/dipendenza
3. **Error Handling**:
   - LocalStorage pieno
   - Browser in modalità privata
   - JavaScript disabilitato

### Automated Testing (future)
- Unit tests: Jest per storage.js, companion.js
- E2E tests: Playwright per user flows
- Visual regression: Percy per UI consistency

---

## Deployment Pipeline

### Current
1. Modifica locale
2. `git push` su GitHub
3. Vercel auto-deploy (< 60 sec)
4. Live su production

### Suggerito (future)
1. Branch `develop` per testing
2. Pull Request → Preview deployment Vercel
3. Review → Merge in `main`
4. Auto-deploy production

---

## Monitoring & Analytics

### Attualmente
- **Nessuno** (per privacy)

### Opzionale (se utente vuole)
- **Vercel Analytics**: Page views (anonimo)
- **Sentry**: Error tracking
- **Google Analytics**: User behavior (con consenso)

---

## License & Credits

### Open Source
- **MIT License**: Permette uso, modifica, distribuzione commerciale
- **Attribution Required**: Mantieni crediti originali

### Dependencies
- **Nessuna**: Zero npm packages
- **Google Fonts**: Nunito, Inter, DM Sans (SIL Open Font License)
- **Emoji**: Unicode standard (no copyright)

---

## Changelog

### v1.0.0 (2025-01-26)
- ✨ Initial release
- 🎮 Onboarding completo
- 🌱 3 tipi compagno con evoluzione
- 📊 Stats e calendario 30 giorni
- 🆘 Sistema SOS con 4 opzioni
- 💰 Salvadanaio virtuale
- ⚙️ Settings completi
- 🎨 Design "cozy" responsive
- 📱 PWA ready

---

**Per domande tecniche o contributi, vedi README.md**
