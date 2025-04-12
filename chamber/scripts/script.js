document.addEventListener('DOMContentLoaded', async function () {
    // Responsive Navigation Menu Toggle
    const menuButton = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Weather API Integration (OpenWeatherMap)
    const apiKey = '360ab4225d923ad598361e6cecfa09f1';
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

    // Directory Page: Fetch members data and render cards using async/await
    const directoryContainer = document.getElementById('directoryList');
    if (directoryContainer) {
        const gridToggle = document.getElementById('gridToggle');
        const listToggle = document.getElementById('listToggle');

        try {
            const response = await fetch('scripts/members.json');
            if (!response.ok) throw new Error(`Failed to fetch members: ${response.status}`);
            const members = await response.json();

            let cardsHtml = '';
            members.forEach(member => {
                let levelName = (member.membership === 3) ? 'Gold'
                    : (member.membership === 2) ? 'Silver'
                        : 'Non-Profit';
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
            directoryContainer.innerHTML = cardsHtml;

        } catch (error) {
            console.error("Error loading member data:", error);
        }

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
            if (!response.ok) throw new Error(`Weather API error: ${response.status}`);
            return response.json();
        })
        .then(data => {
            const weatherTodayElem = document.querySelector('.weather-today');
            if (weatherTodayElem) {
                const currentTemp = Math.round((data.main.temp - 32) * (5 / 9));
                const description = data.weather[0].description.replace(/\b\w/g, c => c.toUpperCase());
                const highTemp = Math.round((data.main.temp_max - 32) * (5 / 9));
                const lowTemp = Math.round((data.main.temp_min - 32) * (5 / 9));
                const humidity = data.main.humidity;
                const timezoneOffset = data.timezone;

                const convertToLocalTime = (unixTimestamp, timezoneOffset) => {
                    const date = new Date((unixTimestamp + timezoneOffset) * 1000);
                    return date.toISOString().substr(11, 5);
                };

                const sunrise = convertToLocalTime(data.sys.sunrise, timezoneOffset);
                const sunset = convertToLocalTime(data.sys.sunset, timezoneOffset);

                weatherTodayElem.innerHTML = `
                    <p><strong>${currentTemp}°C</strong> – ${description}</p>
                    <p>High: ${highTemp}°C, Low: ${lowTemp}°C</p>
                    <p>Humidity: ${humidity}%</p>
                    <p>Sunrise: ${sunrise} AM, Sunset: ${sunset} PM</p>`;
            } else {
                console.warn("Element .weather-today not found");
            }
        })
        .catch(err => console.error("Weather fetch error:", err));

    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) throw new Error(`Forecast API Error: ${response.status}`);
            return response.json();
        })
        .then(data => {
            const forecastContainer = document.querySelector('.forecast');
            if (forecastContainer) {
                const forecasts = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 3);
                forecastContainer.innerHTML = '';

                forecasts.forEach(day => {
                    const date = new Date(day.dt_txt);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                    const temp = Math.round((day.main.temp - 32) * (5 / 9));
                    forecastContainer.innerHTML += `<li>${dayName}: <strong>${temp}°C</strong></li>`;
                });
            } else {
                console.warn("Element .forecast not found");
            }
        })
        .catch(error => console.error('Error fetching forecast:', error));



    // Randomly Select Business Spotlights from members.json
    fetch('scripts/members.json')
        .then(response => response.json())
        .then(members => {
            const goldSilverMembers = members.filter(member => [2, 3].includes(member.membership));
            const shuffledMembers = goldSilverMembers.sort(() => 0.5 - Math.random());
            const selectedMembers = shuffledMembers.slice(0, Math.floor(Math.random() * 2) + 2);

            const spotlightContainer = document.querySelector('.business-spotlights');
            spotlightContainer.innerHTML = '';

            selectedMembers.forEach(member => {
                const membershipType = member.membership === 3 ? 'Gold' : 'Silver';

                spotlightContainer.innerHTML += `
                    <div class="business-card member">
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

    // Modals
    document.querySelectorAll('.open-modal').forEach(btn => {
        btn.onclick = () => document.getElementById(btn.dataset.modal).removeAttribute('hidden');
    });
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.onclick = () => btn.closest('.modal').setAttribute('hidden', '');
    });

    // Timestamp
    document.getElementById('formTimestamp').value = new Date().toISOString();

    // Footer: insert current year and last modified date
    const yearSpan = document.getElementById('currentYear');
    const modSpan = document.getElementById('lastModified');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    if (modSpan) {
        modSpan.textContent = document.lastModified;
    }

    const form = document.querySelector('.form');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Collect and save form data into localStorage
            const formData = {
                name: form.name.value,
                email: form.email.value,
                phone: form.phone.value,
                organization: form.organization.value,
                title: form.title.value,
                level: form.level.value,
                formTimestamp: new Date().toISOString()
            };

            localStorage.setItem('memberData', JSON.stringify(formData));

            // Redirect to thankyou.html
            window.location.href = 'thankyou.html';
        });

        // Automatically set form timestamp on form load
        const timestampInput = document.getElementById('formTimestamp');
        if (timestampInput) timestampInput.value = new Date().toISOString();
    }

    // Modal functionality
    document.querySelectorAll('.open-modal').forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.modal;
            document.getElementById(modalId).removeAttribute('hidden');
        });
    });

    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal').setAttribute('hidden', '');
        });
    });


    const memberData = JSON.parse(localStorage.getItem('memberData'));

    if (memberData) {
        document.getElementById('memberName').textContent = memberData.name;
        document.getElementById('memberEmail').textContent = memberData.email;
        document.getElementById('memberPhone').textContent = memberData.phone;
        document.getElementById('memberOrganization').textContent = memberData.organization;
        document.getElementById('memberLevel').textContent = memberData.level;
        document.getElementById('formTimestamp').textContent = new Date(memberData.formTimestamp).toLocaleString();
    } else {
        document.querySelector('main').innerHTML = '<p>No application data found. Please submit the form again.</p>';
    }

});

document.addEventListener('DOMContentLoaded', () => {
});