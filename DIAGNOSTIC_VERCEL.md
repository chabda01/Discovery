# 🔍 Diagnostic et Correction - Vercel

## ✅ Fichiers Corrigés

J'ai recréé et corrigé :
- ✅ `frontend/src/config/env.js` - Configuration d'environnement
- ✅ `frontend/vercel.json` - Configuration pour le routing SPA
- ✅ Tous les fichiers utilisent maintenant `WS_URL` au lieu de `localhost`

---

## 🚨 Problèmes Probables sur https://kemetlink.vercel.app/

### 1. **Page blanche ou 404**

**Cause** : Le routing SPA n'est pas configuré

**Solution** :
1. Vérifiez que `vercel.json` est présent dans le dossier `frontend/`
2. Dans Vercel Dashboard :
   - Allez dans votre projet
   - Settings > General
   - Vérifiez que "Root Directory" est bien `frontend`
   - Si ce n'est pas le cas, changez-le et redéployez

### 2. **Erreur dans la console : "Cannot find module '../config/env.js'"**

**Cause** : Le fichier n'a pas été déployé

**Solution** :
1. Pousser les modifications sur GitHub :
   ```bash
   git add frontend/src/config/env.js frontend/vercel.json
   git commit -m "Fix: Add environment config"
   git push
   ```
2. Vercel redéploiera automatiquement

### 3. **Erreurs WebSocket : "Failed to connect"**

**Cause** : Variables d'environnement non configurées

**Solution** :
1. Dans Vercel Dashboard :
   - Settings > Environment Variables
   - Ajoutez :
     ```
     VITE_WS_URL=ws://localhost:8080
     ```
   - Sélectionnez : Production, Preview, Development
   - Sauvegarder
2. Redéployer :
   - Deployments > 3 points > Redeploy

### 4. **Erreur de build sur Vercel**

**Cause** : Dépendances manquantes ou erreur de compilation

**Solution** :
1. Vérifiez les logs de build dans Vercel
2. Assurez-vous que `npm run build` fonctionne localement (✅ ça fonctionne)
3. Vérifiez que toutes les dépendances sont dans `package.json`

---

## 🔧 Actions Immédiates à Faire

### Étape 1 : Vérifier la Configuration Vercel

1. **Aller sur** https://vercel.com/dashboard
2. **Sélectionner votre projet** `kemetlink`
3. **Settings > General** :
   - ✅ Framework Preset : Vite
   - ✅ Root Directory : `frontend`
   - ✅ Build Command : `npm run build`
   - ✅ Output Directory : `dist`

### Étape 2 : Pousser les Fichiers sur GitHub

```bash
cd /home/vinksmark/Projet_EPITECH_2ème_année/1st_Semester/Piscine/Discovery/Discovery
git add frontend/src/config/env.js frontend/vercel.json
git commit -m "Fix: Add environment config and Vercel routing"
git push
```

Vercel redéploiera automatiquement.

### Étape 3 : Configurer les Variables d'Environnement

1. **Dans Vercel** : Settings > Environment Variables
2. **Ajouter** :
   ```
   VITE_WS_URL=ws://localhost:8080
   ```
   (Pour l'instant, même sans backend déployé, cela évitera les erreurs)

3. **Redéployer** après avoir ajouté les variables

---

## 🧪 Test Rapide

Pour vérifier que tout est correct :

1. **Ouvrir** https://kemetlink.vercel.app dans votre navigateur
2. **Ouvrir la console** (F12 > Console)
3. **Vérifier les erreurs** :
   - Si vous voyez "Cannot find module" → Les fichiers ne sont pas déployés
   - Si vous voyez "404" → Le routing n'est pas configuré
   - Si vous voyez "WebSocket connection failed" → Normal si le backend n'est pas déployé

---

## 📋 Checklist de Vérification

- [ ] `frontend/src/config/env.js` existe et est poussé sur GitHub
- [ ] `frontend/vercel.json` existe et est poussé sur GitHub
- [ ] Root Directory dans Vercel est `frontend`
- [ ] Variables d'environnement configurées dans Vercel
- [ ] Redéploiement effectué après les modifications
- [ ] Build fonctionne localement (✅ confirmé)

---

## 🆘 Si ça ne fonctionne toujours pas

**Partagez-moi** :
1. Les erreurs dans la console du navigateur (F12)
2. Les logs de build dans Vercel (Deployments > Logs)
3. Ce que vous voyez exactement sur https://kemetlink.vercel.app

Cela m'aidera à identifier le problème exact.
