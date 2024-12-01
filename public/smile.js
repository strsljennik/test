// Funkcija za otvaranje modalnog prozora sa smilovima
document.getElementById('smilesBtn').addEventListener('click', function() {
    document.getElementById('smileModal').style.display = 'flex';
});

// Funkcija za zatvaranje modalnog prozora
function closeSmileModal() {
    document.getElementById('smileModal').style.display = 'none';
}

// Funkcija za dodavanje smilova u chat
function addSmile(smile) {
    const chatInput = document.getElementById('chatInput');
    chatInput.value += smile; 
    document.getElementById('messageArea').innerHTML += `<span style="font-size: 24px;">${smile}</span>`;
    closeSmileModal();
}

// Dodavanje HTML koda za modalni prozor sa smilovima
const smileModalHTML = `
    <div id="smileModal" style="display: none; position: fixed; top: 50%; left: 0; transform: translateY(-50%); background: black; padding: 10px; border: 1px solid white; z-index: 1000; width: 200px; height: 400px; overflow-y: scroll;">
        <div id="smileContainer" style="display: flex; flex-direction: column; color: white;">
            <!-- Uvećani emotikoni -->
            <span class="smile" onclick="addSmile('😀')">😀</span>
            <span class="smile" onclick="addSmile('😂')">😂</span>
            <span class="smile" onclick="addSmile('😍')">😍</span>
            <span class="smile" onclick="addSmile('😎')">😎</span>
            <span class="smile" onclick="addSmile('😢')">😢</span>
            <span class="smile" onclick="addSmile('😡')">😡</span>
            <span class="smile" onclick="addSmile('🤔')">🤔</span>
            <span class="smile" onclick="addSmile('👍')">👍</span>
            <span class="smile" onclick="addSmile('👎')">👎</span>
            <span class="smile" onclick="addSmile('💋')">💋</span> <!-- Poljubac sa usnama -->
            <span class="smile" onclick="addSmile('💕')">💕</span> <!-- Dva srca -->
            <span class="smile" onclick="addSmile('💞')">💞</span> <!-- Rotirajuća srca -->
            <span class="smile" onclick="addSmile('❤️')">❤️</span>
            <span class="smile" onclick="addSmile('💔')">💔</span>
            <span class="smile" onclick="addSmile('🌧️')">🌧️</span>
            <span class="smile" onclick="addSmile('☀️')">☀️</span>
            <span class="smile" onclick="addSmile('🎶')">🎶</span>
            <span class="smile" onclick="addSmile('🎉')">🎉</span>
            <span class="smile" onclick="addSmile('🔥')">🔥</span>
            <span class="smile" onclick="addSmile('🎵')">🎵</span>
            <span class="smile" onclick="addSmile('😜')">😜</span>
            <span class="smile" onclick="addSmile('😝')">😝</span>
            <span class="smile" onclick="addSmile('😻')">😻</span>
            <span class="smile" onclick="addSmile('🤩')">🤩</span>
            <span class="smile" onclick="addSmile('🥳')">🥳</span>
            <span class="smile" onclick="addSmile('🤗')">🤗</span>
            <span class="smile" onclick="addSmile('🌈')">🌈</span>
            <span class="smile" onclick="addSmile('❄️')">❄️</span>
            <span class="smile" onclick="addSmile('🌪️')">🌪️</span>
            <span class="smile" onclick="addSmile('🌊')">🌊</span>
            <span class="smile" onclick="addSmile('🌍')">🌍</span>
            <span class="smile" onclick="addSmile('🌻')">🌻</span>
            <span class="smile" onclick="addSmile('🌼')">🌼</span>
            <span class="smile" onclick="addSmile('🌷')">🌷</span>
            <span class="smile" onclick="addSmile('🍀')">🍀</span>
            <span class="smile" onclick="addSmile('🍎')">🍎</span>
            <span class="smile" onclick="addSmile('🥑')">🥑</span>
            <span class="smile" onclick="addSmile('🥥')">🥥</span>
            <span class="smile" onclick="addSmile('🍉')">🍉</span>
            <span class="smile" onclick="addSmile('🥭')">🥭</span>
            <span class="smile" onclick="addSmile('🍌')">🍌</span>
            <span class="smile" onclick="addSmile('🍓')">🍓</span>
            <span class="smile" onclick="addSmile('🧁')">🧁</span>
            <span class="smile" onclick="addSmile('🍰')">🍰</span>
            <span class="smile" onclick="addSmile('🎂')">🎂</span>
            <span class="smile" onclick="addSmile('🍹')">🍹</span>
            <span class="smile" style="font-size: 24px; cursor: pointer;" onclick="addSmile('😍')">😍</span>
            <span class="smile" style="font-size: 24px; cursor: pointer;" onclick="addSmile('😘')">😘</span>
            <span class="smile" style="font-size: 24px; cursor: pointer;" onclick="addSmile('🤩')">🤩</span>
            <span class="smile" style="font-size: 24px; cursor: pointer;" onclick="addSmile('🖤')">🖤</span>
            <span class="smile" style="font-size: 24px; cursor: pointer;" onclick="addSmile('💛')">💛</span>
            <span class="smile" style="font-size: 24px; cursor: pointer;" onclick="addSmile('💚')">💚</span>
            <span class="smile" style="font-size: 24px; cursor: pointer;" onclick="addSmile('😁')">😁</span>
            <span class="smile" style="font-size: 24px; cursor: pointer;" onclick="addSmile('😢')">😢</span>
            <span class="smile" style="font-size: 24px; cursor: pointer;" onclick="addSmile('🤐')">🤐</span>
            <span class="smile" style="font-size: 24px; cursor: pointer;" onclick="addSmile('🤟')">🤟</span>
            <span class="smile" style="font-size: 24px; cursor: pointer;" onclick="addSmile('👁️‍🗨️')">👁️‍🗨️</span>
            <span class="smile" style="font-size: 24px; cursor: pointer;" onclick="addSmile('👀')">👀</span>
            <span class="smile" style="font-size: 24px; cursor: pointer;" onclick="addSmile('🚹')">🚹</span>
            <span class="smile" style="font-size: 24px; cursor: pointer;" onclick="addSmile('🚺')">🚺</span>
            <button onclick="closeSmileModal()" style="margin-top: 10px;">Zatvori</button>
        </div>
    </div>
`;

// Umetanje modalnog HTML-a u telo stranice
document.body.insertAdjacentHTML('beforeend', smileModalHTML);
