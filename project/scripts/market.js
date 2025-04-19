// market.js – Handles fetching listings and item detail modal
import { initNav } from './nav.js';

initNav();

const cardsContainer = document.getElementById('cards-container');
const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');
const closeModalBtn = document.getElementById('closeModal');

let itemsData = [];

// Fetch the JSON data of listings
async function loadListings() {
    try {
        const response = await fetch('scripts/items.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        itemsData = await response.json();
        renderCards(itemsData);
    } catch (err) {
        console.error('Error loading listings:', err);
        if (cardsContainer) {
            cardsContainer.innerHTML = `<p class="loading error-message">Failed to load listings. Please try again later.</p>`;
        }
    }
}

// Render item cards into the cards container
function renderCards(items) {
    if (!cardsContainer) return;
    if (!items || items.length === 0) {
        cardsContainer.innerHTML = '<p class="loading">No items to display.</p>';
        return;
    }
    // Build cards HTML using template literals
    const cardsHTML = items.map(item => {
        const priceText = `$${item.price}${item.rateUnit ? '/' + item.rateUnit : ''}`;
        return `
      <div class="card">
        <img src="${item.image}" alt="${item.title}" width="300" height="200" loading="lazy">
        <div class="card-info">
          <h3>${item.title}</h3>
          <p class="price">${priceText}</p>
          <p class="category">${item.category}</p>
          <button class="details-btn" data-id="${item.id}">View Details</button>
        </div>
      </div>
    `;
    }).join('');
    cardsContainer.innerHTML = cardsHTML;
    attachDetailButtons();
}

// Attach event listeners to all "View Details" buttons
function attachDetailButtons() {
    const detailButtons = document.querySelectorAll('.details-btn');
    detailButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const itemId = btn.getAttribute('data-id');
            const item = itemsData.find(obj => obj.id === Number(itemId));
            if (item) {
                console.log("Opening modal for:", item.title);
                openModal(item);
            }
        });
    });
}

// Open the modal and display item details
function openModal(item) {
    if (!modalOverlay || !modalContent) return;
    // Populate modal content with item details
    const priceText = `$${item.price}${item.rateUnit ? '/' + item.rateUnit : ''}`;
    modalContent.innerHTML = `
        <h3>${item.title}</h3>
        <img src="${item.image}" alt="${item.title}" width="300" height="200">
        <p>${item.description}</p>
        <p><strong>Price:</strong> ${priceText}</p>
        ${item.condition ? `<p><strong>Condition:</strong> ${item.condition}</p>` : ''}
        <p><strong>Category:</strong> ${item.category}</p>
        ${item.learnMore ? `<p><strong>Learn More:</strong> ${item.learnMore}</p>` : ''}
        `;

    // Show the modal
    modalOverlay.classList.add('show');
    modalOverlay.removeAttribute('aria-hidden');
}

// Close the modal dialog
function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('show');
    modalOverlay.setAttribute('aria-hidden', 'true');
    // Clear modal content to free memory (optional)
    if (modalContent) {
        modalContent.innerHTML = '';
    }
}

// Event: Close modal on button click
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}
// Event: Close modal if clicking outside the dialog content
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}
// Event: Close modal on Esc key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('show')) {
        closeModal();
    }
});

// Initialize: load the listings on page load
loadListings();
