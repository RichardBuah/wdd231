// signup.js – Handles Sign-Up form validation, localStorage saving, and redirect
import { initNav } from './nav.js';

initNav();

const signupForm = document.getElementById('signupForm');

if (signupForm) {
  signupForm.addEventListener('submit', event => {
    event.preventDefault();

    // Field values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const termsChecked = document.getElementById('agreeTerms').checked;

    let valid = true;
    let errorMsg = "";

    // Helper to mark field error
    const markError = (fieldId, msg) => {
      valid = false;
      errorMsg += msg + "\\n";
      const fieldEl = document.getElementById(fieldId);
      if (fieldEl) fieldEl.classList.add('error');
    };

    // Reset previous errors
    ['firstName','lastName','signupEmail','signupPassword','confirmPassword'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('error');
    });

    // Validate fields
    if (!firstName) {
      markError('firstName', "First name is required.");
    }
    if (!lastName) {
      markError('lastName', "Last name is required.");
    }
    if (!email) {
      markError('signupEmail', "Email is required.");
    } else if (!/^[/^\S+@\S+\.\S+$/]+$/.test(email)) {
      markError('signupEmail', "Please enter a valid email address.");
    }
    if (!password) {
      markError('signupPassword', "Password is required.");
    } else if (password.length < 6) {
      markError('signupPassword', "Password must be at least 6 characters.");
    }
    if (!confirmPassword) {
      markError('confirmPassword', "Please confirm your password.");
    } else if (password && password !== confirmPassword) {
      markError('confirmPassword', "Passwords do not match.");
    }
    if (!termsChecked) {
      valid = false;
      errorMsg += "You must agree to the terms.\n";
    }

    if (!valid) {
      alert("Please fix the following errors:\n" + errorMsg);
      return;
    }

    // Save user data (excluding password for security)
    const userData = {
      firstName,
      lastName,
      email,
      // We will not store the plain password; just note that it's set.
      passwordSet: true
    };
    try {
      localStorage.setItem('signupData', JSON.stringify(userData));
    } catch (e) {
      console.warn('Could not save signup data to localStorage.', e);
    }

    // Redirect to signup confirmation page
    window.location.assign('signupconfirmation.html');
  });
}
