fetch('https://radiogalaksija.onrender.com/messages')
    .then(response => response.json())
    .then(messages => {
        const listElement = document.getElementById('messagesList');
        messages.forEach(msg => {
            const li = document.createElement('li');
            li.textContent = `${msg.message} (IP: ${msg.ip})`;
            listElement.appendChild(li);
        });
    })
    .catch(error => console.error('Greška:', error));
