// Enhanced Theme Toggle Functionality with Auto Mode
class ThemeToggle {
  constructor() {
    this.modes = ['light', 'dark', 'auto'];
    this.currentModeIndex = 0;
    this.isLoading = false;
    this.init();
  }

  init() {
    // Show loading state
    this.showLoadingState();
    
    // Initialize theme from localStorage or system preference
    this.setInitialTheme();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Listen for system theme changes
    this.watchSystemTheme();
    
    // Hide loading state after initialization
    setTimeout(() => this.hideLoadingState(), 300);
  }

  setInitialTheme() {
    const savedMode = localStorage.getItem('theme-mode') || 'auto';
    
    // Set the current mode index based on saved preference
    this.currentModeIndex = this.modes.indexOf(savedMode);
    if (this.currentModeIndex === -1) this.currentModeIndex = 2; // Default to auto
    
    this.applyTheme(savedMode);
  }

  applyTheme(mode) {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let actualTheme;
    
    switch (mode) {
      case 'light':
        actualTheme = 'light';
        break;
      case 'dark':
        actualTheme = 'dark';
        break;
      case 'auto':
      default:
        actualTheme = systemPrefersDark ? 'dark' : 'light';
        break;
    }
    
    this.setTheme(actualTheme, mode);
  }

  setTheme(theme, mode = null) {
    const root = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    
    // Update data attribute
    root.setAttribute('data-theme', theme);
    
    // Update button aria-label and title with mode information
    if (themeToggle) {
      const currentMode = mode || this.modes[this.currentModeIndex];
      const nextMode = this.modes[(this.currentModeIndex + 1) % this.modes.length];
      
      let modeLabel = '';
      if (currentMode === 'auto') {
        modeLabel = `Auto (${theme === 'dark' ? 'Dark' : 'Light'})`;
      } else {
        modeLabel = currentMode.charAt(0).toUpperCase() + currentMode.slice(1);
      }
      
      const newLabel = `Current: ${modeLabel}. Click to switch to ${nextMode.charAt(0).toUpperCase() + nextMode.slice(1)}`;
      themeToggle.setAttribute('aria-label', newLabel);
      themeToggle.setAttribute('title', newLabel);
      
      // Add mode indicator
      this.updateModeIndicator(currentMode, theme);
    }
    
    // Save to localStorage
    if (mode) {
      localStorage.setItem('theme-mode', mode);
    }
    
    // Announce theme change to screen readers
    this.announceThemeChange(theme, mode || this.modes[this.currentModeIndex]);
  }

  toggleTheme() {
    // Cycle through light -> dark -> auto
    this.currentModeIndex = (this.currentModeIndex + 1) % this.modes.length;
    const newMode = this.modes[this.currentModeIndex];
    this.applyTheme(newMode);
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
      // Only auto-update if current mode is 'auto'
      const currentMode = this.modes[this.currentModeIndex];
      if (currentMode === 'auto') {
        this.setTheme(e.matches ? 'dark' : 'light', 'auto');
      }
    });
  }

  announceThemeChange(theme, mode) {
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
    
    let message = `Switched to ${theme} theme`;
    if (mode === 'auto') {
      message += ' (auto mode)';
    }
    announcement.textContent = message;
  }

  updateModeIndicator(mode, theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    // Remove existing mode classes
    themeToggle.classList.remove('mode-light', 'mode-dark', 'mode-auto');
    
    // Add current mode class
    themeToggle.classList.add(`mode-${mode}`);
    
    // Update CSS custom property for enhanced styling
    themeToggle.style.setProperty('--current-mode', `"${mode}"`);
    themeToggle.style.setProperty('--current-theme', `"${theme}"`);
  }

  showLoadingState() {
    this.isLoading = true;
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.classList.add('loading');
      themeToggle.style.setProperty('--loading-opacity', '0.7');
    }
  }

  hideLoadingState() {
    this.isLoading = false;
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.classList.remove('loading');
      themeToggle.style.removeProperty('--loading-opacity');
    }
  }

  // Method to reset theme preference (useful for testing)
  resetTheme() {
    localStorage.removeItem('theme-mode');
    localStorage.removeItem('theme'); // Remove old theme storage
    this.currentModeIndex = 2; // Reset to auto
    this.setInitialTheme();
  }

  // Method to get current theme and mode
  getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme');
  }

  getCurrentMode() {
    return this.modes[this.currentModeIndex];
  }

  // Method to set specific mode (useful for testing)
  setMode(mode) {
    const modeIndex = this.modes.indexOf(mode);
    if (modeIndex !== -1) {
      this.currentModeIndex = modeIndex;
      this.applyTheme(mode);
    }
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