class ThemeService {
  constructor() {
    this.currentTheme = this.getStoredTheme() || 'dark';
    this.listeners = new Set();
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;
    
    // Appliquer le thème au chargement
    this.applyTheme(this.currentTheme);
    
    // Écouter les changements de préférence système
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        if (!this.getStoredTheme()) {
          this.setTheme(e.matches ? 'dark' : 'light', false);
        }
      });
    }
  }

  getStoredTheme() {
    try {
      return localStorage.getItem('theme') || null;
    } catch (e) {
      return null;
    }
  }

  setStoredTheme(theme) {
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.warn('Could not save theme preference');
    }
  }

  getTheme() {
    return this.currentTheme;
  }

  setTheme(theme, save = true) {
    if (theme !== 'light' && theme !== 'dark') {
      console.warn('Invalid theme:', theme);
      return;
    }

    this.currentTheme = theme;
    this.applyTheme(theme);
    
    if (save) {
      this.setStoredTheme(theme);
    }
    
    this.notifyListeners();
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    console.log('Toggling theme from', this.currentTheme, 'to', newTheme);
    this.setTheme(newTheme);
  }

  applyTheme(theme) {
    const root = document.documentElement;
    
    // Retirer toutes les classes de thème d'abord
    root.classList.remove('dark', 'light');
    
    // Ajouter la classe du thème actuel
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
    
    console.log('Theme applied:', theme, 'Classes:', root.classList.toString());
  }

  subscribe(callback) {
    this.listeners.add(callback);
    // Appeler immédiatement avec le thème actuel
    callback(this.currentTheme);
    
    // Retourner une fonction pour se désabonner
    return () => {
      this.listeners.delete(callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(callback => {
      callback(this.currentTheme);
    });
  }
}

// Export singleton
const themeService = new ThemeService();
export default themeService;
