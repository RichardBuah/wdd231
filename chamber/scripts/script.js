document.addEventListener('DOMContentLoaded', function() {
    // Responsive Navigation Menu Toggle
    const menuButton = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuButton && navLinks) {
      menuButton.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        // Update aria-label for accessibility
        if (navLinks.classList.contains('open')) {
          menuButton.setAttribute('aria-label', 'Close Menu');
        } else {
          menuButton.setAttribute('aria-label', 'Open Menu');
        }
      });
    }
  
    // Directory Page: Fetch members data and render cards
    const directoryContainer = document.getElementById('directoryList');
    if (directoryContainer) {
      const gridToggle = document.getElementById('gridToggle');
      const listToggle = document.getElementById('listToggle');
  
      // Fetch the JSON data of members
      fetch('scripts/members.json')
        .then(response => response.json())
        .then(members => {
          let cardsHtml = '';
          members.forEach(member => {
            // Determine membership level name from numeric code
            let levelName = (member.membership === 3) ? 'Gold'
                          : (member.membership === 2) ? 'Silver'
                          : 'Non-Profit';
            // Construct HTML for each member card
            cardsHtml += `
              <div class="member">
                <img src="${member.image}" alt="Photo of ${member.name}">
                <div class="member-info">
                  <h3>${member.name}</h3>
                  <p><em>${member.tagline}</em></p>
                  <p>${member.address}<br>
                     ${member.phone}<br>
                     <a href="${member.website}" target="_blank" rel="noopener">
                       ${member.website.replace(/^https?:\/\//, '')}
                     </a>
                  </p>
                  <p class="member-level ${levelName.toLowerCase()}">${levelName} Member</p>
                </div>
              </div>`;
          });
          // Insert all member cards into the container
          directoryContainer.innerHTML = cardsHtml;
        });
  
      // Toggle view buttons functionality
      gridToggle.addEventListener('click', () => {
        directoryContainer.classList.add('grid-view');
        directoryContainer.classList.remove('list-view');
        gridToggle.classList.add('active');
        listToggle.classList.remove('active');
      });
      listToggle.addEventListener('click', () => {
        directoryContainer.classList.add('list-view');
        directoryContainer.classList.remove('grid-view');
        listToggle.classList.add('active');
        gridToggle.classList.remove('active');
      });
    }
  
    // Footer: insert current year and last modified date
    const yearSpan = document.getElementById('currentYear');
    const modSpan = document.getElementById('lastModified');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
    if (modSpan) {
      modSpan.textContent = document.lastModified;
    }
  });
  