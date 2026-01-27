# 🌱 Streak Guardian

**Il tuo compagno digitale per superare le dipendenze**

Un'applicazione web progressiva (PWA) gratuita e open-source per aiutare le persone a combattere le dipendenze attraverso un sistema gamificato di streak tracking con compagni virtuali che evolvono.

---

## ✨ Caratteristiche

### 🎮 Core Features
- **Onboarding guidato**: Flow in 4 step per configurare l'app
- **3 Tipi di Compagno**: Pianta 🌱, Animale 🥚, o Fiamma 🔥
- **Sistema di Evoluzione**: Il compagno cresce con la tua streak (giorni 3, 7, 30)
- **Check-in Giornaliero**: Traccia i tuoi progressi ogni giorno
- **15+ Dipendenze Supportate**: Social media, fumo, alcol, gaming, e altro
- **Dipendenza Personalizzata**: Opzione per inserire qualsiasi dipendenza

### 📊 Statistiche & Tracking
- **Streak Corrente**: Giorni consecutivi senza cedere
- **Streak Più Lunga**: Record personale
- **Calendario 30 Giorni**: Visualizzazione grafica dei successi
- **Counter SOS**: Momenti difficili superati
- **Salvadanaio Virtuale**: Calcola quanto hai risparmiato

### 🆘 Supporto Emergenza
- **Pulsante SOS**: Aiuto immediato nei momenti di craving
- **4 Opzioni di Supporto**:
  - Chiama un amico
  - Esco a camminare
  - Scrivo cosa sento
  - Timer respirazione (5 minuti)

### 🎨 Design & UX
- **Design "Cozy"**: Palette colori calda e accogliente
- **Animazioni Fluide**: 60fps garantiti
- **Responsive Perfetto**: Mobile-first design
- **Micro-interazioni**: Feedback visivo su ogni azione
- **PWA Ready**: Installabile come app nativa

### 🔒 Privacy
- **100% Locale**: Tutti i dati salvati solo sul dispositivo
- **Zero Tracking**: Nessuna analisi, nessun server
- **Export Dati**: Backup in formato JSON
- **Open Source**: Codice completamente aperto

---

## 🚀 Deploy su Vercel

### Prerequisiti
- Account GitHub (gratuito)
- Account Vercel (gratuito)

### Step-by-Step

#### 1. Carica su GitHub

**Opzione A: Via GitHub Web**
1. Vai su github.com
2. Clicca "New repository"
3. Nome: `streak-guardian`
4. Pubblico o Privato (a tua scelta)
5. Clicca "Create repository"
6. Carica tutti i file dal progetto

**Opzione B: Via Git (se lo conosci)**
```bash
cd streak-guardian
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TUO-USERNAME/streak-guardian.git
git push -u origin main
```

#### 2. Deploy su Vercel

1. Vai su **vercel.com**
2. Login/Signup (usa GitHub per facilitare)
3. Clicca **"Add New..."** → **"Project"**
4. Clicca **"Continue with GitHub"** (se prima volta)
5. Autorizza Vercel ad accedere a GitHub
6. Seleziona il repository `streak-guardian`
7. Clicca **"Import"**
8. Configurazione:
   - **Project Name**: `streak-guardian` (o personalizza)
   - **Framework Preset**: Other
   - **Root Directory**: `./`
9. Clicca **"Deploy"**
10. ⏳ Aspetta 30-60 secondi
11. 🎉 **FATTO!** L'app è online

#### 3. URL dell'App

Vercel ti darà un URL tipo:
```
https://streak-guardian-xyz123.vercel.app
```

Questo è il link pubblico della tua app!

---

## 📱 Installazione come App

### Su iPhone (Safari)
1. Apri l'app nel browser
2. Tap sull'icona "Condividi" (quadrato con freccia ↑)
3. Scorri e tap "Aggiungi a Home"
4. Tap "Aggiungi"
5. ✅ L'app appare sulla home come app nativa

### Su Android (Chrome)
1. Apri l'app nel browser
2. Tap sui 3 puntini (⋮) in alto
3. Tap "Aggiungi a schermata Home"
4. Tap "Aggiungi"
5. ✅ L'app appare sulla home come app nativa

---

## 🛠️ Personalizzazione

### Modificare i Colori

Apri `css/main.css` e modifica le variabili CSS:

```css
:root {
  /* Cambia il colore primario (verde) */
  --color-primary: #10B981;  /* <- Modifica questo */
  
  /* Cambia lo sfondo */
  --color-bg: #F9FAFB;       /* <- Modifica questo */
  
  /* Cambia il colore del testo */
  --color-text: #1F2937;     /* <- Modifica questo */
}
```

### Aggiungere Nuove Dipendenze

Apri `index.html` e cerca la sezione "addiction-grid":

```html
<button class="addiction-card" onclick="selectAddiction('NOME-DIPENDENZA')">
  <span class="addiction-icon">🎯</span>
  <span class="addiction-name">Nome Visualizzato</span>
</button>
```

Poi apri `js/storage.js` e aggiungi il nome al dizionario:

```javascript
const names = {
  'NOME-DIPENDENZA': 'Nome Visualizzato',
  // ... altri
};
```

### Modificare Messaggi

Apri `js/companion.js` e cerca la funzione `getPersonalizedMessage`:

```javascript
const messages = {
  plant: {
    general: "Il tuo messaggio personalizzato qui",
    // ...
  }
};
```

### Modificare Milestones Evoluzione

Apri `js/companion.js` e modifica i `MILESTONES`:

```javascript
MILESTONES: {
  plant: [
    { days: 0, emoji: '🌰', name: 'Seme' },
    { days: 5, emoji: '🌱', name: 'Germoglio' },  // Cambia da 3 a 5
    // ...
  ]
}
```

---

## 📂 Struttura Progetto

```
streak-guardian/
├── index.html              # Pagina principale (HTML completo)
├── manifest.json           # PWA manifest
├── vercel.json            # Config Vercel
├── sw.js                  # Service Worker (offline)
├── css/
│   ├── main.css           # Stili principali
│   └── animations.css     # Animazioni
└── js/
    ├── app.js             # Logica principale
    ├── storage.js         # Gestione localStorage
    ├── companion.js       # Sistema compagno/evoluzione
    └── stats.js           # Calcoli statistiche
```

---

## 🐛 Debugging

### L'app non si carica
1. Apri DevTools (F12)
2. Tab "Console"
3. Cerca errori rossi
4. Verifica che tutti i file siano presenti

### I dati non si salvano
1. Apri DevTools (F12)
2. Tab "Application" → "Local Storage"
3. Verifica che localStorage sia abilitato
4. Controlla se ci sono dati salvati

### L'animazione è lenta
1. Apri DevTools (F12)
2. Tab "Performance"
3. Registra 5 secondi
4. Cerca bottleneck

### Test in locale
1. Installa un server locale (es. `python -m http.server`)
2. Apri `http://localhost:8000`
3. Testa tutte le funzionalità

---

## 🔄 Aggiornamenti Futuri

Per aggiornare l'app dopo il primo deploy:

1. Modifica i file localmente
2. Carica le modifiche su GitHub:
   ```bash
   git add .
   git commit -m "Descrizione modifiche"
   git push
   ```
3. Vercel **si aggiorna automaticamente** (deploy automatico)
4. Refresh del browser → Nuova versione live!

---

## 📋 Checklist Completa

### Prima del Deploy
- [ ] Tutti i file sono nella cartella
- [ ] Ho testato l'onboarding completo
- [ ] Ho testato check-in, SOS, stats, settings
- [ ] Ho testato su mobile (Chrome DevTools)
- [ ] Ho verificato che i dati persistono (refresh pagina)

### Durante Deploy
- [ ] Repository GitHub creato
- [ ] Tutti i file caricati su GitHub
- [ ] Account Vercel creato
- [ ] Repository importato su Vercel
- [ ] Deploy completato con successo

### Dopo Deploy
- [ ] App accessibile al link Vercel
- [ ] Testato onboarding su app live
- [ ] Testato su smartphone reale
- [ ] Installato come PWA
- [ ] Condiviso link con amici per test

---

## ❓ FAQ

### È davvero gratis?
Sì! Vercel offre hosting gratuito illimitato per progetti personali.

### Posso usare un dominio custom?
Sì! Nelle impostazioni Vercel puoi collegare un tuo dominio (es. `streakguardian.com`).

### I dati sono al sicuro?
Tutti i dati sono salvati SOLO sul tuo dispositivo. Niente server, niente cloud.

### Cosa succede se cambio telefono?
Devi esportare i dati (Settings → Esporta) prima di cambiare device.

### Posso contribuire al progetto?
Assolutamente! Il codice è open source. Fork del repo e pull request welcome!

### Posso monetizzare l'app?
Il codice è tuo. Puoi fare quello che vuoi, ma considera di mantenerla gratuita per massimo impatto sociale.

---

## 🙏 Credits

- **Sviluppato da**: Sukh (con l'aiuto di Claude AI)
- **Design**: Ispirato da Duolingo, Calm, Forest, Headspace
- **Font**: Google Fonts (Nunito, Inter, DM Sans)
- **Icone**: Emoji Unicode standard

---

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT. Sei libero di:
- ✅ Usarlo personalmente
- ✅ Modificarlo
- ✅ Distribuirlo
- ✅ Usarlo commercialmente

L'unica condizione: mantieni l'attribuzione originale.

---

## 💪 Supporto

Se hai domande o problemi:
1. Apri un Issue su GitHub
2. Contatta via email (se fornisci)
3. Chiedi nella community

---

## 🌟 Contribuisci

Pull request benvenute! Per modifiche importanti, apri prima un Issue per discuterne.

---

**Made with ❤️ for people fighting their battles.**

*Remember: You're not alone. One day at a time.* 🌱
