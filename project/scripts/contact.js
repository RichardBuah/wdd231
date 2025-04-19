// contact.js – Handles Contact form submission and localStorage saving
import { initNav } from './nav.js';

initNav();

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault(); // prevent actual form submit

    // Gather form field values
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    // Simple validation
    let valid = true;
    let errorMsg = "";

    // Helper to accumulate errors
    const addError = (msg, fieldId) => {
      valid = false;
      errorMsg += msg + "\\n";
      const fieldElem = document.getElementById(fieldId);
      if (fieldElem) fieldElem.classList.add('error');
    };

    // Reset any previous error highlights
    ['contactName','contactEmail','contactMessage'].forEach(id => {
      const field = document.getElementById(id);
      if (field) field.classList.remove('error');
    });

    if (!name) {
      addError("Name is required.", 'contactName');
    }
    if (!email) {
      addError("Email is required.", 'contactEmail');
    } else if (!/^[/^\S+@\S+\.\S+$/]+$/.test(email)) {
      addError("Please enter a valid email address.", 'contactEmail');
    }
    if (!message) {
      addError("Message cannot be empty.", 'contactMessage');
    }

    if (!valid) {
      alert("Please correct the following:\n" + errorMsg);
      return;
    }

    // Create an object of the data and save to localStorage
    const contactData = { name, email, message };
    try {
      localStorage.setItem('contactSubmission', JSON.stringify(contactData));
    } catch (e) {
      console.warn('LocalStorage might be full or not available.', e);
    }
    // Redirect to confirmation page
    window.location.assign('contactconfirmation.html');
  });
}
