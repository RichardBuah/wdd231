// signup-confirm.js – Displays sign-up info from localStorage and clears it
import { initNav } from './nav.js';

initNav();

const resultDiv = document.getElementById('signupResult');

let signupData;
try {
  const stored = localStorage.getItem('signupData');
  signupData = stored ? JSON.parse(stored) : null;
} catch (e) {
  signupData = null;
}

if (resultDiv) {
  if (signupData) {
    resultDiv.innerHTML = `
      <p><strong>Name:</strong> ${signupData.firstName} ${signupData.lastName}</p>
      <p><strong>Email:</strong> ${signupData.email}</p>
      <p><strong>Password:</strong> <em>(hidden for security)</em></p>
    `;
  } else {
    resultDiv.innerHTML = '<p class="note">No sign-up data found. Please fill out the registration form.</p>';
  }
}

// Clear the stored sign-up data for security
try {
  localStorage.removeItem('signupData');
} catch(e) {
  /* ignore */
}
