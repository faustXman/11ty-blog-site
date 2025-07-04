// Touch Handler for Circular Navigation
class TouchHandler {
  constructor() {
    this.touchStartTime = 0;
    this.touchStartPosition = { x: 0, y: 0 };
    this.maxTouchDuration = 500; // Maximum touch duration for a tap
    this.maxTouchMovement = 10; // Maximum movement for a tap
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupTouchHandlers());
    } else {
      this.setupTouchHandlers();
    }
  }

  setupTouchHandlers() {
    // Get all navigation circles
    const navCircles = document.querySelectorAll('.nav-circle');
    
    console.log('TouchHandler: Found', navCircles.length, 'navigation circles');
    
    navCircles.forEach((circle, index) => {
      // Add multiple event listeners for maximum compatibility
      this.addTouchListeners(circle, index);
      this.addClickListeners(circle, index);
      this.addVisualFeedback(circle);
    });
  }

  addTouchListeners(element, index) {
    // Touch events
    element.addEventListener('touchstart', (e) => {
      console.log('TouchHandler: Touch start on circle', index);
      this.handleTouchStart(e, element);
    }, { passive: false });

    element.addEventListener('touchend', (e) => {
      console.log('TouchHandler: Touch end on circle', index);
      this.handleTouchEnd(e, element);
    }, { passive: false });

    element.addEventListener('touchmove', (e) => {
      this.handleTouchMove(e);
    }, { passive: false });

    // Prevent default touch behaviors that might interfere
    element.addEventListener('touchcancel', (e) => {
      this.handleTouchCancel(e, element);
    });
  }

  addClickListeners(element, index) {
    // Fallback click event
    element.addEventListener('click', (e) => {
      console.log('TouchHandler: Click on circle', index);
      this.handleClick(e, element);
    });

    // Pointer events (modern approach)
    element.addEventListener('pointerdown', (e) => {
      console.log('TouchHandler: Pointer down on circle', index);
      this.handlePointerDown(e, element);
    });

    element.addEventListener('pointerup', (e) => {
      console.log('TouchHandler: Pointer up on circle', index);
      this.handlePointerUp(e, element);
    });
  }

  addVisualFeedback(element) {
    // Add visual feedback class
    element.classList.add('touch-enabled');
    
    // Ensure element has proper styling for touch
    element.style.cursor = 'pointer';
    element.style.userSelect = 'none';
    element.style.webkitUserSelect = 'none';
    element.style.touchAction = 'manipulation';
  }

  handleTouchStart(e, element) {
    e.preventDefault();
    
    this.touchStartTime = Date.now();
    
    if (e.touches && e.touches.length > 0) {
      this.touchStartPosition = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    }
    
    // Add visual feedback without transform changes to prevent position glitches
    element.classList.add('touch-active');
    element.style.opacity = '0.7';
    element.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
    // Don't modify transform to prevent ghost movement
    
    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }

  handleTouchEnd(e, element) {
    e.preventDefault();
    
    const touchDuration = Date.now() - this.touchStartTime;
    let touchMovement = 0;
    
    if (e.changedTouches && e.changedTouches.length > 0) {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      touchMovement = Math.sqrt(
        Math.pow(endX - this.touchStartPosition.x, 2) + 
        Math.pow(endY - this.touchStartPosition.y, 2)
      );
    }
    
    // Remove visual feedback
    element.classList.remove('touch-active');
    element.style.opacity = '';
    element.style.backgroundColor = '';
    // Don't reset transform to prevent position glitches
    
    // Check if this was a valid tap
    if (touchDuration < this.maxTouchDuration && touchMovement < this.maxTouchMovement) {
      console.log('TouchHandler: Valid tap detected, navigating...');
      this.navigateToLink(element);
    }
  }

  handleTouchMove(e) {
    // Allow small movements, but prevent default for larger ones
    if (e.touches && e.touches.length > 0) {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      
      const movement = Math.sqrt(
        Math.pow(currentX - this.touchStartPosition.x, 2) + 
        Math.pow(currentY - this.touchStartPosition.y, 2)
      );
      
      if (movement > this.maxTouchMovement) {
        e.preventDefault();
      }
    }
  }

  handleTouchCancel(e, element) {
    // Remove visual feedback
    element.classList.remove('touch-active');
    element.style.opacity = '';
    element.style.backgroundColor = '';
    // Don't reset transform to prevent position glitches
  }

  handleClick(e, element) {
    // Fallback click handler
    console.log('TouchHandler: Click handler triggered');
    this.navigateToLink(element);
  }

  handlePointerDown(e, element) {
    if (e.pointerType === 'touch') {
      element.classList.add('touch-active');
      element.style.opacity = '0.7';
      element.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
      // Don't modify transform to prevent ghost movement
    }
  }

  handlePointerUp(e, element) {
    if (e.pointerType === 'touch') {
      element.classList.remove('touch-active');
      element.style.opacity = '';
      element.style.backgroundColor = '';
      // Don't reset transform to prevent position glitches
      
      console.log('TouchHandler: Pointer up navigation');
      this.navigateToLink(element);
    }
  }

  navigateToLink(element) {
    const href = element.getAttribute('href');
    const target = element.getAttribute('target');
    
    if (href) {
      console.log('TouchHandler: Navigating to', href);
      
      // Add navigation feedback
      element.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      setTimeout(() => {
        element.style.backgroundColor = '';
      }, 200);
      
      // Navigate
      if (target === '_blank') {
        window.open(href, '_blank');
      } else if (href.startsWith('#')) {
        // Handle anchor links
        const targetElement = document.querySelector(href);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Regular navigation
        window.location.href = href;
      }
    } else {
      console.warn('TouchHandler: No href found on element');
    }
  }
}

// Initialize touch handler
const touchHandler = new TouchHandler();

// Make it available globally for debugging
window.touchHandler = touchHandler;

console.log('TouchHandler: Loaded and initialized'); 