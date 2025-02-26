// Funkcija za otvaranje modalnog prozora sa smajlovima
document.getElementById('smilesBtn').addEventListener('click', () => {
    const smileModal = document.getElementById('smileModal');
    const { bottom, left } = document.getElementById('smilesBtn').getBoundingClientRect();
    Object.assign(smileModal.style, {
        top: `${bottom + 5}px`,
        left: `${left}px`,
        display: 'flex'
    });

    // Učitaj sadržaj iz localStorage pri otvaranju modala
    loadContentFromLocalStorage();
});

// Funkcija za zatvaranje modala
const closeSmileModal = () => document.getElementById('smileModal').style.display = 'none';

// Funkcija za dodavanje smajlova u chat
const addSmile = (smile) => {
    document.getElementById('chatInput').value += smile;
    closeSmileModal();
};

// Dodajemo HTML za modal
const smileModalHTML = `
<div id="smileModal" style="display:none;position:fixed;width:450px;background:black;padding:10px;border:1px solid white;z-index:1000;overflow-y:auto;border-radius:5px;color:white;flex-wrap:wrap;">
    <button onclick="closeSmileModal()" style="background:red;color:white;border:none;padding:5px 10px;cursor:pointer;float:right;">X</button>
    <div id="smileContainer" style="display:flex;flex-wrap:wrap;gap:8px;"></div>
</div>`;

if (!document.getElementById('smileModal')) document.body.insertAdjacentHTML('beforeend', smileModalHTML);

const smileContainer = document.getElementById('smileContainer');
const emojiFolder = 'emoji gif/';

// Lista svih emojija i slika
const items = [
    ...['☕', '😀', '😂', '😍', '😎', '😢', '😡', '🤔', '👍', '👎', '😜', '😝', '😻', '🤩', '🥳', '🤗', '🤐', '🤟', '💋', '💕', '💞', '❤️', '💔', '🖤', '💛', '💚', '🌧️', '☀️', '🌷', '🚹', '🚺', '👁️‍🗨️', '👀'].map(e => ({ type: 'emoji', content: e })),
    ...['stik1.png', 'stik2.png', 'stik3.png', 'stik4.png', 'stik5.png', 'stik6.png', 'stik7.png', 'stik8.png', 'stik9.png', 'stik10.png', 'dance.gif', 'dance1.gif', 'dance2.gif', 'dance3.gif', 'ily1.gif', 'ily2.gif', 'man.gif', 'mira.gif', 'mira1.gif', 'rg.gif', 'srce.gif', 'srce2.gif', 'srce3.gif', 'srce4.gif'].map(img => ({ type: 'image', content: img }))
];

// Funkcija za čuvanje sadržaja u localStorage
function saveContentToLocalStorage() {
    const content = [];

    // Dodajemo sve slike iz modalnog prozora
    const images = document.querySelectorAll('#smileContainer img');
    images.forEach(img => {
        content.push(img.src);  // Sačuvaj putanju slike
    });

    // Dodajemo sve emojije iz modalnog prozora
    const emojis = document.querySelectorAll('#smileContainer span');
    emojis.forEach(span => {
        if (span.textContent) content.push(span.textContent);  // Sačuvaj emoji
    });

    // Spremi sadržaj u localStorage
    localStorage.setItem('emojiGifContent', JSON.stringify(content));
}

// Funkcija za učitavanje sadržaja iz localStorage
function loadContentFromLocalStorage() {
    const storedContent = localStorage.getItem('emojiGifContent');
    
    if (storedContent) {
        const content = JSON.parse(storedContent);

        // Dodajemo slike i emojije ponovo u modal
        content.forEach(item => {
            const span = document.createElement('span');
            span.classList.add('smile');

            // Ako je sadržaj putanja slike, dodaj sliku
            if (item.includes('.gif') || item.includes('.png')) {
                const img = document.createElement('img');
                img.src = item;
                img.alt = item;
                span.appendChild(img);
            } else {
                // Inače, dodajemo emoji
                span.textContent = item;
            }

            span.onclick = () => addSmile(item);
            smileContainer.appendChild(span);
        });
    }
}

// Dodavanje emojija i slika u modal
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

// Čuvanje sadržaja svaki put kad se zatvori modal
window.addEventListener('beforeunload', saveContentToLocalStorage);
