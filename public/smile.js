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
    const smileModal = document.getElementById('smileModal');
    smileModal.innerHTML = ''; // Očisti modal pre nego što dodaš nove slike

    const allItems = JSON.parse(localStorage.getItem('emojiData')) || [];
    allItems.forEach(item => {
        const element = document.createElement('span');
        let imgElement;

        if (item.type === 'emoji') {
            element.textContent = item.content;
            element.classList.add('smile');
            element.onclick = () => addSmile(item.content);
        } else if (item.type === 'image') {
            imgElement = document.createElement('img');
            imgElement.src = emojiFolder + item.content;
            imgElement.classList.add('smile');
            imgElement.alt = item.content;
            element.classList.add('smile');
            element.onclick = () => addImageToChat(emojiFolder + item.content);
            element.appendChild(imgElement);
        }

        smileModal.appendChild(element);
    });
};

// Funkcija za dodavanje emojija u chat
const addSmile = (smile) => {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.value += smile;
        closeSmileModal();
    }
};

// Funkcija za dodavanje slike u chat
const addImageToChat = (imgSrc) => {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.value += ` <img src="${imgSrc}" alt="emoji"> `;
        closeSmileModal();
    }
};

// Funkcija za zatvaranje modalnog prozora
const closeSmileModal = () => {
    const smileModal = document.getElementById('smileModal');
    if (smileModal) {
        smileModal.style.display = 'none';
    }
};

// HTML kod za modal
const smileModalHTML = `
<div id="smileModal" style="display:none;position:fixed;width:450px;background:black;padding:10px;border:1px solid white;z-index:1000;overflow-y:auto;border-radius:5px;color:white;flex-wrap:wrap;">
    <button onclick="closeSmileModal()" style="background:red;color:white;border:none;padding:5px 10px;cursor:pointer;float:right;">X</button>
    <div id="smileContainer" style="display:flex;flex-wrap:wrap;gap:8px;"></div>
</div>`;

if (!document.getElementById('smileModal')) document.body.insertAdjacentHTML('beforeend', smileModalHTML);

// Popis slika i emojija
const emojiFolder = 'emoji gif/';
const allItems = [
    ...['☕', '😀', '😂', '😍', '😎', '😢', '😡', '🤔', '👍', '👎', '😜', '😝', '😻', '🤩', '🥳', '🤗', '🤐', '🤟', '💋', '💕', '💞', '❤️', '💔', '🖤', '💛', '💚', '🌧️', '☀️', '🌷', '🚹', '🚺', '👁️‍🗨️', '👀'].map(e => ({ type: 'emoji', content: e })),
    ...['stik1.png', 'stik2.png', 'stik3.png', 'stik4.png', 'stik5.png', 'stik6.png', 'stik7.png', 'stik8.png', 'stik9.png', 'stik10.png', 'dance.gif', 'dance1.gif', 'dance2.gif', 'dance3.gif', 'ily1.gif', 'ily2.gif', 'man.gif', 'mira.gif', 'mira1.gif', 'rg.gif', 'srce.gif', 'srce2.gif', 'srce3.gif', 'srce4.gif'].map(img => ({ type: 'image', content: img }))
];

// Čuvanje slika u localStorage
const saveImagesToLocalStorage = () => {
    localStorage.setItem('emojiData', JSON.stringify(allItems));
};

// Pozivamo funkciju da sačuvamo slike u localStorage
saveImagesToLocalStorage();
