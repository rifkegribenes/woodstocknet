async function loadEvents() {
    try {
        const response = await fetch('events.json');

        if (!response.ok) {
            throw new Error(`Failed to load events: ${response.status}`);
        }

        const events = await response.json();

        const now = new Date();

        // Combine date + start time into a Date object,
        // then keep only upcoming events.
        const upcomingEvents = events
            .map(event => ({
                ...event,
                startDate: new Date(`${event.date}T${event.startTime}:00`)
            }))
            .filter(event => event.startDate > now)
            .sort((a, b) => a.startDate - b.startDate)
            .slice(0, 3);

        renderEvents(upcomingEvents);

    } catch (error) {
        console.error('Unable to load events:', error);
    }
}


function renderEvents(events) {
    const container = document.getElementById('event-cards');

    if (!container) {
        return;
    }

    container.innerHTML = '';

    events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
            <div
                class="card-img"
                style="
                    background-image: url('${event.imageUrl}');
                    background-position: ${event.imagePosition || 'center center'};
                "
                role="img"
                aria-label="${event.title}"
            ></div>

            <h3>${event.title}</h3>

            <p class="event-details">
                <strong>${formatEventDate(event.date)}, ${formatTimeRange(event.startTime, event.endTime)}</strong><br>
                ${event.location}<br>
                ${event.address}
            </p>

            <p class="event-desc">${event.description}</p>

            ${event.buttonText && event.buttonLink
                ? `<a class="card-btn" href="${event.buttonLink}">${event.buttonText}</a>`
                : ''
            }
        `;

        container.appendChild(card);
    });
}


function formatEventDate(dateString) {
    const date = new Date(`${dateString}T12:00:00`);

    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
    });
}


function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();

    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    });
}


function formatTimeRange(startTime, endTime) {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}


document.addEventListener('DOMContentLoaded', loadEvents);