document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('thankYouContainer');
    const memberData = JSON.parse(localStorage.getItem('memberData'));

    if (memberData) {
      container.innerHTML = `
        <h2>Application Submitted Successfully!</h2>
        <p>Thank you, <strong>${memberData.name}</strong>, for joining the Cape Coast Chamber of Commerce.</p>
        <p><strong>Email:</strong> ${memberData.email}</p>
        <p><strong>Phone:</strong> ${memberData.phone}</p>
        <p><strong>Organization:</strong> ${memberData.organization}</p>
        <p><strong>Membership Level:</strong> ${memberData.level}</p>
        <p><em>Submitted on ${new Date(memberData.formTimestamp).toLocaleString()}</em></p>
      `;
    } else {
      container.innerHTML = '<p>No application data found. Please submit the form again.</p>';
    }

    // Footer dynamic data
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    document.getElementById('lastModified').textContent = document.lastModified;
  });