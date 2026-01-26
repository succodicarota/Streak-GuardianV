# 🚀 ISTRUZIONI DEPLOY RAPIDE

## Cosa Devi Fare (5 Minuti Totali)

### STEP 1: Scarica i File (fatto ✅)
Hai già tutti i file nella cartella `streak-guardian/`

### STEP 2: Carica su GitHub

#### Opzione A: Via GitHub Web (PIÙ FACILE)

1. **Vai su github.com** e fai login
2. **Clicca "New repository"** (bottone verde in alto a destra)
3. **Nome repository**: `streak-guardian`
4. **Descrizione**: "App per combattere dipendenze"
5. **Pubblico o Privato**: Scegli tu (Pubblico consigliato)
6. **NON** selezionare "Add README" (ce l'hai già)
7. **Clicca "Create repository"**

8. **Nella nuova pagina**, vedrai istruzioni. Segui questi comandi nel terminale:

```bash
cd /home/claude/streak-guardian
git init
git add .
git commit -m "Initial commit - Streak Guardian"
git branch -M main
git remote add origin https://github.com/TUO-USERNAME/streak-guardian.git
git push -u origin main
```

**OPPURE usa GitHub Desktop** (se preferisci interfaccia grafica):
1. Scarica GitHub Desktop
2. File → Add Local Repository → Scegli cartella `streak-guardian`
3. Publish Repository

---

### STEP 3: Deploy su Vercel

1. **Vai su vercel.com**
2. **Clicca "Sign Up"** (se non hai account)
3. **Scegli "Continue with GitHub"**
4. **Autorizza Vercel** (clicca "Authorize Vercel" quando richiesto)

5. **Clicca "Add New..."** → **"Project"**
6. **Clicca "Import"** accanto a `streak-guardian`
7. **Deploy Settings**:
   - Project Name: `streak-guardian` (o quello che vuoi)
   - Framework: Other
   - Root Directory: ./
   - **Lascia tutto il resto come sta**
8. **Clicca "Deploy"**

9. ⏳ **Aspetta 30-60 secondi**

10. 🎉 **FATTO!** Vercel ti mostra il link: `https://streak-guardian-xyz.vercel.app`

---

### STEP 4: Testa l'App

1. **Clicca "Visit"** o apri il link
2. **Testa l'onboarding**:
   - Scegli dipendenza
   - Scegli compagno
   - Dai un nome
3. **Testa check-in**: "Non ho ceduto"
4. **Testa SOS**: Premi il bottone rosso
5. **Testa Stats**: Tab in basso
6. **Testa Settings**: Cambia nome, ecc.

7. **Apri da smartphone**:
   - Vai al link da Chrome/Safari
   - Testa che funzioni
   - Installa come app (vedi README)

---

## ✅ Checklist Veloce

- [ ] Account GitHub creato/loggato
- [ ] Repository `streak-guardian` creato
- [ ] File caricati su GitHub (via web o git)
- [ ] Account Vercel creato
- [ ] GitHub collegato a Vercel
- [ ] Progetto importato e deployato
- [ ] App testata al link Vercel
- [ ] App testata su mobile
- [ ] (Opzionale) Installata come PWA

---

## 🆘 Se Qualcosa Va Storto

### "Non riesco a caricare su GitHub"
→ Usa GitHub Desktop (più facile) oppure carica i file manualmente via web

### "Vercel non trova il mio repository"
→ Assicurati di aver fatto "Publish" su GitHub (repository deve essere visibile)

### "Deploy failed"
→ Controlla che tutti i file siano presenti. Vedi la lista in README.md

### "L'app non funziona"
→ Apri DevTools (F12) → Console → Vedi errori rossi → Dimmi quali sono

---

## 📧 Link Che Ti Serviranno

- **GitHub**: https://github.com
- **Vercel**: https://vercel.com
- **GitHub Desktop**: https://desktop.github.com (se preferisci UI)

---

## 🎯 Prossimi Step (Dopo Deploy)

1. **Condividi il link** con amici per test
2. **Raccogli feedback**: Cosa funziona? Cosa no?
3. **Itera**: Modifiche → git push → Auto-deploy
4. **Lancia su Reddit** (quando pronto)

---

## 💡 Tips Pro

- **Personalizza URL**: Settings Vercel → Domains → Aggiungi custom domain
- **Analytics**: Settings Vercel → Analytics (gratis fino a 100k visite)
- **Monitora**: Dashboard Vercel mostra visite in real-time

---

**DOMANDE?** Fammi sapere! Sono qui per aiutarti. 💪

Good luck! 🚀
