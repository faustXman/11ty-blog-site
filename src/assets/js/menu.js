document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('.menu-button');
  const circularMenu = document.querySelector('.circular-menu');

  menuButton.addEventListener('click', () => {
    circularMenu.classList.toggle('active');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!circularMenu.contains(e.target)) {
      circularMenu.classList.remove('active');
    }
  });
}); 