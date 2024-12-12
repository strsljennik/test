// Funkcija za otvaranje modalnog prozora sa smajlovima
document.getElementById('smilesBtn').addEventListener('click', function() {
    const smileModal = document.getElementById('smileModal');
    const smilesBtn = document.getElementById('smilesBtn');

    const buttonRect = smilesBtn.getBoundingClientRect();
    smileModal.style.top = `${buttonRect.bottom + 5}px`; // Pozicionirano ispod dugmeta
    smileModal.style.left = `${buttonRect.left}px`;
    smileModal.style.display = 'flex';
});

// Funkcija za zatvaranje modalnog prozora
function closeSmileModal() {
    document.getElementById('smileModal').style.display = 'none';
}

// Funkcija za dodavanje smajlova u chat
function addSmile(smile) {
    const chatInput = document.getElementById('chatInput');
    chatInput.value += smile; 
    closeSmileModal();
}

// Dodavanje HTML koda za modalni prozor sa smajlovima
const smileModalHTML = `
    <div id="smileModal" style="
        display: none; 
        position: fixed; 
        width: 200px; 
        height: 200px; 
        background: black; 
        padding: 10px; 
        border: 1px solid white; 
        z-index: 1000; 
        overflow-y: scroll; 
        border-radius: 5px;
        color: white;">
        <div id="smileContainer" style="display: flex; flex-wrap: wrap; gap: 8px;">
<span class="smile" onclick="addSmile('☕')">☕</span>
 <span class="smile" style="font-size: 24px;" onclick="addSmile('😀')">😀</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('😂')">😂</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('😍')">😍</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('😎')">😎</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('😢')">😢</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('😡')">😡</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('🤔')">🤔</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('👍')">👍</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('👎')">👎</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('😜')">😜</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('😝')">😝</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('😻')">😻</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('🤩')">🤩</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('🥳')">🥳</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('🤗')">🤗</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('😢')">😢</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('🤐')">🤐</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('🤟')">🤟</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('💋')">💋</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('💕')">💕</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('💞')">💞</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('❤️')">❤️</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('💔')">💔</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('🖤')">🖤</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('💛')">💛</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('💚')">💚</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('🌧️')">🌧️</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('☀️')">☀️</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('🌈')">🌈</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('🌍')">🌍</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('🌻')">🌻</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('🌼')">🌼</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('🌷')">🌷</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('🍀')">🍀</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('🍎')">🍎</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('🥑')">🥑</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('🥥')">🥥</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('🍉')">🍉</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('🥭')">🥭</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('🍌')">🍌</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('🍓')">🍓</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('🧁')">🧁</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('🍰')">🍰</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('🎂')">🎂</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('🍹')">🍹</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('🚹')">🚹</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('🚺')">🚺</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('👁️‍🗨️')">👁️‍🗨️</span>
<span class="smile" style="font-size: 24px;" onclick="addSmile('👀')">👀</span>
        
         `;

// Umetanje modalnog HTML-a u telo stranice
document.body.insertAdjacentHTML('beforeend', smileModalHTML);
