document.addEventListener('DOMContentLoaded', function () {
    // Responsive Navigation Menu Toggle
    const menuButton = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Weather API Integration (OpenWeatherMap)
    const apiKey = '65095cc4071fed44ef86d98cba12514f';
    const city = 'Accra';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

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

    fetch(weatherUrl)
        .then(response => {
            if (!response.ok) throw new Error(`Weather API Error: ${response.status}`);
            return response.json();
        })
        .then(data => {
            const currentTemp = Math.round(data.main.temp);
            const description = data.weather[0].description.replace(/\b\w/g, c => c.toUpperCase());

            document.querySelector('.weather-today').innerHTML =
                `<p><strong>${currentTemp}°F</strong> – ${description}</p>`;
        })
        .catch(error => console.error('Error fetching weather:', error));

    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) throw new Error(`Forecast API Error: ${response.status}`);
            return response.json();
        })
        .then(data => {
            const forecasts = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 3);
            const forecastContainer = document.querySelector('.forecast');
            forecastContainer.innerHTML = '';

            forecasts.forEach(day => {
                const date = new Date(day.dt_txt);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                const temp = Math.round(day.main.temp);
                forecastContainer.innerHTML += `<li>${dayName}: <strong>${temp}°F</strong></li>`;
            });
        })
        .catch(error => console.error('Error fetching forecast:', error));


    // Randomly Select Business Spotlights from members.json
    fetch('scripts/members.json')
        .then(response => response.json())
        .then(members => {
            const goldSilverMembers = members.filter(member => [2, 3].includes(member.membership));
            const shuffledMembers = goldSilverMembers.sort(() => 0.5 - Math.random());
            const selectedMembers = shuffledMembers.slice(0, Math.floor(Math.random() * 2) + 2); // 2 or 3

            const spotlightContainer = document.querySelector('.business-spotlights');
            spotlightContainer.innerHTML = '';

            selectedMembers.forEach(member => {
                const membershipType = member.membership === 3 ? 'Gold' : 'Silver';

                spotlightContainer.innerHTML += `
            <div class="business-card">
              <img src="${member.image}" alt="${member.name}" />
              <h3>${member.name}</h3>
              <p>${member.tagline}</p>
              <p>
                Phone: ${member.phone}<br>
                Address: ${member.address}<br>
                Website: <a href="${member.website}" target="_blank">${member.website}</a><br>
                Membership Level: ${membershipType}
              </p>
            </div>`;
            });
        });

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

document.addEventListener('DOMContentLoaded', () => {



});