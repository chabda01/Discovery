# ⚙️ Configuration Vercel - Variables d'Environnement

## 🚨 Problème Actuel

L'application essaie de se connecter à `ws://localhost:8080` car la variable d'environnement n'est pas configurée dans Vercel.

## ✅ Solution : Configurer les Variables d'Environnement

### Étape 1 : Aller dans Vercel Dashboard

1. **Ouvrir** https://vercel.com/dashboard
2. **Sélectionner votre projet** `kemetlink`
3. **Aller dans** Settings > Environment Variables

### Étape 2 : Ajouter la Variable

**Ajoutez cette variable** :

```
Nom : VITE_WS_URL
Valeur : ws://localhost:8080
```

**Important** :
- Sélectionnez **Production**, **Preview**, et **Development**
- Cliquez sur **Save**

### Étape 3 : Redéployer

1. **Aller dans** Deployments
2. **Cliquer sur les 3 points** du dernier déploiement
3. **Sélectionner** "Redeploy"
4. **Attendre** que le déploiement se termine

---

## 🔧 Si vous avez un Backend Déployé

Si vous avez déployé le backend sur Railway (ou autre service), utilisez l'URL du backend :

```
Nom : VITE_WS_URL
Valeur : wss://votre-backend.railway.app
```

⚠️ **Important** : Utilisez `wss://` (WebSocket Secure) en production, pas `ws://`

---

## 📝 Code Modifié

J'ai modifié le code pour :
- ✅ Ne pas essayer de se connecter si `VITE_WS_URL` n'est pas configuré en production
- ✅ Afficher un avertissement au lieu d'une erreur
- ✅ Éviter les erreurs de connexion WebSocket en production

---

## ✅ Après Configuration

Une fois la variable configurée et le redéploiement effectué :
- ✅ L'erreur WebSocket disparaîtra
- ✅ L'application fonctionnera normalement
- ✅ Si le backend n'est pas déployé, l'app fonctionnera sans WebSocket (mode dégradé)

---

## 🧪 Vérification

1. **Ouvrir** https://kemetlink.vercel.app
2. **Ouvrir la console** (F12)
3. **Vérifier** :
   - ✅ Plus d'erreur "WebSocket connection failed"
   - ✅ Soit une connexion réussie, soit un avertissement "WebSocket URL not configured"
