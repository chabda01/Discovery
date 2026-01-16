// Configuration des URLs selon l'environnement
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Pour WebSocket, en production, ne pas utiliser localhost
const getWSURL = () => {
  const envURL = import.meta.env.VITE_WS_URL;
  if (envURL) return envURL;
  
  // En production, si pas de variable d'environnement, désactiver WebSocket
  if (import.meta.env.PROD) {
    console.warn('VITE_WS_URL not configured. WebSocket disabled in production.');
    return null; // Désactiver WebSocket en production si non configuré
  }
  
  // En développement, utiliser localhost par défaut
  return 'ws://localhost:8080';
};

export const WS_URL = getWSURL();

// Détection de l'environnement
export const isProduction = import.meta.env.PROD;
export const isDevelopment = import.meta.env.DEV;
