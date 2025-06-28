// Theme Toggle Functionality
class ThemeToggle {
  constructor() {
    this.init();
  }

  init() {
    // Initialize theme from localStorage or system preference
    this.setInitialTheme();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Listen for system theme changes
    this.watchSystemTheme();
  }

  setInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      // User has set a preference
      this.setTheme(savedTheme);
    } else if (systemPrefersDark) {
      // No saved preference, use system preference
      this.setTheme('dark');
    } else {
      // Default to light theme
      this.setTheme('light');
    }
  }

  setTheme(theme) {
    const root = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    
    // Update data attribute
    root.setAttribute('data-theme', theme);
    
    // Update button aria-label
    if (themeToggle) {
      const newLabel = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
      themeToggle.setAttribute('aria-label', newLabel);
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Announce theme change to screen readers
    this.announceThemeChange(theme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  setupEventListeners() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
      
      // Add keyboard support
      themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleTheme();
        }
      });
    }
  }

  watchSystemTheme() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      // Only auto-update if user hasn't set a preference
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  announceThemeChange(theme) {
    // Create or update a live region for screen reader announcements
    let announcement = document.getElementById('theme-announcement');
    if (!announcement) {
      announcement = document.createElement('div');
      announcement.id = 'theme-announcement';
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.style.position = 'absolute';
      announcement.style.left = '-10000px';
      announcement.style.width = '1px';
      announcement.style.height = '1px';
      announcement.style.overflow = 'hidden';
      document.body.appendChild(announcement);
    }
    
    announcement.textContent = `Switched to ${theme} theme`;
  }

  // Method to reset theme preference (useful for testing)
  resetTheme() {
    localStorage.removeItem('theme');
    this.setInitialTheme();
  }

  // Method to get current theme
  getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme');
  }
}

// Initialize theme toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = new ThemeToggle();
  
  // Make themeToggle available globally for debugging
  window.themeToggle = themeToggle;
});

// Also handle the case where the script loads after DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = new ThemeToggle();
    window.themeToggle = themeToggle;
  });
} else {
  const themeToggle = new ThemeToggle();
  window.themeToggle = themeToggle;
} 