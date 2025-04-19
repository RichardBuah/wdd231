// contact-confirm.js – Displays submitted contact form data from localStorage and cleans up
import { initNav } from './nav.js';

initNav();

const resultDiv = document.getElementById('contactResult');

// Retrieve contact form data
let contactData;
try {
  const stored = localStorage.getItem('contactSubmission');
  contactData = stored ? JSON.parse(stored) : null;
} catch (e) {
  contactData = null;
}

if (resultDiv) {
  if (contactData) {
    resultDiv.innerHTML = `
      <p><strong>Name:</strong> ${contactData.name}</p>
      <p><strong>Email:</strong> ${contactData.email}</p>
      <p><strong>Message:</strong> ${contactData.message}</p>
      <p class="note">Your message has been sent. We will respond to the email provided.</p>
    `;
  } else {
    resultDiv.innerHTML = `<p class="note">No contact submission found. Please fill out the contact form first.</p>`;
  }
}

// Optionally clear the stored data so it doesn't persist
try {
  localStorage.removeItem('contactSubmission');
} catch(e) {
  /* ignore */
}
