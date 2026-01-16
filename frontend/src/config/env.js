// Configuration des URLs selon l'environnement
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';

// Détection de l'environnement
export const isProduction = import.meta.env.PROD;
export const isDevelopment = import.meta.env.DEV;
