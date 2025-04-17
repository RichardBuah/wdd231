document.addEventListener('DOMContentLoaded', async () => {

    // Responsive Navigation Menu Toggle
    const menuButton = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuButton && navLinks) {
        menuButton.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            menuButton.setAttribute('aria-label', navLinks.classList.contains('open') ? 'Close Menu' : 'Open Menu');
        });
    }

    // Footer year and modification date
    const yearSpan = document.getElementById('currentYear');
    const modSpan = document.getElementById('lastModified');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    if (modSpan) modSpan.textContent = document.lastModified;

    const cardContainer = document.getElementById('interestCards');
    if (!cardContainer) return;

    try {
        const response = await fetch('/chamber/data/items.json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const items = await response.json();

        items.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('card');

            card.innerHTML = `
                    <h2>${item.name}</h2>
                    <figure>
                        <img src="${item.image}" alt="${item.name}">
                    </figure>
                    <address>${item.address}</address>
                    <p>${item.description}</p>
                    <button>Learn More</button>
                `;

            cardContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading items of interest:', error);
        cardContainer.innerHTML = '<p>Failed to load points of interest.</p>';
    }

    const visitArea = document.querySelector('.visit-message');
    const MILLISECONDS_PER_DAY = 86400000;
    const now = Date.now();
    const lastVisit = Number(localStorage.getItem("lastVisit")) || 0;
    const daysSinceLastVisit = Math.floor((now - lastVisit) / MILLISECONDS_PER_DAY);

    if (visitArea) {
        let message;
        if (!lastVisit) {
            message = "Welcome! Let us know if you have any questions.";
        } else if (daysSinceLastVisit < 1) {
            message = "Back so soon! Awesome!";
        } else {
            message = `You last visited ${daysSinceLastVisit} day${daysSinceLastVisit === 1 ? '' : 's'} ago.`;
        }
        visitArea.textContent = message;
        localStorage.setItem("lastVisit", now);
    }


});
