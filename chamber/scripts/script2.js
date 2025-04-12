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

    // Weather API Integration
    const apiKey = '360ab4225d923ad598361e6cecfa09f1';
    const city = 'Accra';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

    // Weather Today
    const weatherTodayElem = document.querySelector('.weather-today');
    if (weatherTodayElem) {
        try {
            const response = await fetch(weatherUrl);
            const data = await response.json();
            const currentTemp = Math.round(data.main.temp);
            const description = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
            const highTemp = Math.round(data.main.temp_max);
            const lowTemp = Math.round(data.main.temp_min);
            const humidity = data.main.humidity;
            const sunrise = new Date((data.sys.sunrise + data.timezone) * 1000).toISOString().substr(11, 5);
            const sunset = new Date((data.sys.sunset + data.timezone) * 1000).toISOString().substr(11, 5);

            weatherTodayElem.innerHTML = `
                <p>${currentTemp}°F – ${description}</p>
                <p>High: ${highTemp}°F, Low: ${lowTemp}°F</p>
                <p>Humidity: ${humidity}%</p>
                <p>Sunrise: ${sunrise}, Sunset: ${sunset}</p>`;
        } catch (error) {
            console.error('Weather error:', error);
        }
    }

    // Directory Members Display (only when container exists)
    const directoryContainer = document.getElementById('directoryList');
    if (directoryContainer) {
        try {
            const response = await fetch('scripts/members.json');
            const members = await response.json();
            let cardsHtml = '';
            members.forEach(member => {
                cardsHtml += `<div class="member">${member.name}</div>`;
            });
            directoryContainer.innerHTML = cardsHtml;
        } catch (error) {
            console.error("Members error:", error);
        }
    }

    // Business Spotlights (if exists)
    const spotlightContainer = document.querySelector('.business-spotlights');
    if (spotlightContainer) {
        try {
            const response = await fetch('scripts/members.json');
            const members = await response.json();
            const selectedMembers = members.filter(m => [2, 3].includes(m.membership)).sort(() => Math.random() - 0.5).slice(0, 3);
            spotlightContainer.innerHTML = selectedMembers.map(m => `<div>${m.name}</div>`).join('');
        } catch (error) {
            console.error("Spotlights error:", error);
        }
    }

    // Modal functionality (ensure only defined once)
    document.querySelectorAll('.open-modal').forEach(btn => {
        btn.addEventListener('click', () => document.getElementById(btn.dataset.modal).removeAttribute('hidden'));
    });
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => btn.closest('.modal').setAttribute('hidden', ''));
    });

    // Form handling (Join page only)
    const form = document.querySelector('.form');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();

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
            window.location.href = 'thankyou.html';
        });

        // Automatically set timestamp on load
        const timestampInput = document.getElementById('formTimestamp');
        if (timestampInput) timestampInput.value = new Date().toISOString();
    }

    // Display applicant data (Thank You page only)
    if (document.body.id === 'thankyou-page') {
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
    }

    // Footer year and modification date
    const yearSpan = document.getElementById('currentYear');
    const modSpan = document.getElementById('lastModified');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    if (modSpan) modSpan.textContent = document.lastModified;
});
