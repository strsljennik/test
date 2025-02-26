// Funkcija za otvaranje modalnog prozora sa smajlovima
document.getElementById('smilesBtn').addEventListener('click', () => {
    const smileModal = document.getElementById('smileModal');
    const { bottom, left } = document.getElementById('smilesBtn').getBoundingClientRect();
    Object.assign(smileModal.style, {
        top: `${bottom + 5}px`,
        left: `${left}px`,
        display: 'flex'
    });

    // Učitaj slike iz localStorage
    loadImagesFromLocalStorage();
});

// Funkcija za učitavanje slika iz localStorage
const loadImagesFromLocalStorage = () => {
    const smileContainer = document.getElementById('smileContainer');
    const storedImages = JSON.parse(localStorage.getItem('smiles')) || [];

    // Ako postoje slike u localStorage, dodaj ih u modal
    if (storedImages.length > 0) {
        storedImages.forEach(({ type, content }) => {
            const span = document.createElement('span');
            span.classList.add('smile');
            span.onclick = () => addSmile(type === 'emoji' ? content : `<img src='${emojiFolder + content}' alt='emoji'>`);

            if (type === 'image') {
                const img = document.createElement('img');
                img.src = emojiFolder + content;
                img.alt = content;
                span.appendChild(img);
            } else {
                span.textContent = content;
            }

            smileContainer.appendChild(span);
        });
    }
};

// Funkcija za dodavanje slika u localStorage
const saveImagesToLocalStorage = (images) => {
    localStorage.setItem('smiles', JSON.stringify(images));
};

// Definišemo smajlove, emojije i slike
const smileModalHTML = `...`; // Tvoj HTML kod za modal

// Dodajemo sve slike i emojije u listu
const items = [
    ...['☕', '😀', '😂', '😍', '😎', '😢', '😡', '🤔', '👍', '👎', '😜', '😝', '😻', '🤩', '🥳', '🤗', '🤐', '🤟', '💋', '💕', '💞', '❤️', '💔', '🖤', '💛', '💚', '🌧️', '☀️', '🌷', '🚹', '🚺', '👁️‍🗨️', '👀'].map(e => ({ type: 'emoji', content: e })),
    ...['stik1.png', 'stik2.png', 'stik3.png', 'stik4.png', 'stik5.png', 'stik6.png', 'stik7.png', 'stik8.png', 'stik9.png', 'stik10.png', 'dance.gif', 'dance1.gif', 'dance2.gif', 'dance3.gif', 'ily1.gif', 'ily2.gif', 'man.gif', 'mira.gif', 'mira1.gif', 'rg.gif', 'srce.gif', 'srce2.gif', 'srce3.gif', 'srce4.gif'].map(img => ({ type: 'image', content: img }))
];

// Dodajemo slike u modal
const smileContainer = document.getElementById('smileContainer');
items.forEach(({ type, content }) => {
    const span = document.createElement('span');
    span.classList.add('smile');
    span.onclick = () => addSmile(type === 'emoji' ? content : `<img src='${emojiFolder + content}' alt='emoji'>`);

    if (type === 'image') {
        const img = document.createElement('img');
        img.src = emojiFolder + content;
        img.alt = content;
        span.appendChild(img);
    } else {
        span.textContent = content;
    }

    smileContainer.appendChild(span);
});

// Sačuvaj slike u localStorage
saveImagesToLocalStorage(items);
