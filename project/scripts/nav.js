// nav.js – Handles the responsive navigation menu toggle

export function initNav() {
    const menuButton = document.getElementById('menuBtn');
    const navList = document.querySelector('.nav-list');
  
    if (!menuButton || !navList) return; // safety check
  
    menuButton.addEventListener('click', () => {
      // Toggle the "open" class on the nav list to show/hide it
      const expanded = navList.classList.toggle('open');
      // Update ARIA attributes and button symbol
      menuButton.setAttribute('aria-expanded', expanded);
      if (expanded) {
        menuButton.textContent = '✖'; // X icon when open
        menuButton.setAttribute('aria-label', 'Close Menu');
      } else {
        menuButton.textContent = '☰'; // burger icon when closed
        menuButton.setAttribute('aria-label', 'Open Menu');
      }
    });
  }
  