/* --- JS nhỏ để demo: load từ .playlist-item, play/pause, progress --- */
const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const playBtn2 = document.getElementById('playBtn2');
const progressFill = document.getElementById('progressFill');
const miniProgress = document.getElementById('miniProgress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const miniTime = document.getElementById('miniTime');

// build a playlist from DOM items
const items = Array.from(document.querySelectorAll('.playlist-item'));
const playlist = items.map(it => ({
    src: it.dataset.src,
    cover: it.dataset.cover,
    lyric: it.dataset.lyric,
    title: it.querySelector('.meta div') ? it.querySelector('.meta div').innerText : 'Unknown',
    artist: it.querySelector('.meta div + div') ? it.querySelector('.meta div + div').innerText : ''
}));
let currentIndex = 0;

function loadTrack(index) {
    const t = playlist[index];
    if (!t) return;
    audio.src = t.src;
    document.getElementById('mainCover').src = t.cover || 'images/cover1.jpg';
    document.getElementById('miniCover').src = t.cover || 'images/cover1.jpg';
    document.getElementById('songTitle').innerText = t.title || 'Tên bài hát';
    document.getElementById('songArtist').innerText = t.artist || '';
    document.getElementById('miniTitle').innerText = t.title || '';
    document.getElementById('miniArtist').innerText = t.artist || '';
    // load lyrics (nếu file lyric là đường dẫn tới txt, bạn cần fetch nó từ server)
    document.getElementById('lyricText').innerText = 'Lời chưa được load - bạn có thể fetch "' + (t.lyric || '') + '" từ server.';
    // set current index
    currentIndex = index;
    audio.load();
}

function togglePlay() {
    if (audio.paused) {
        audio.play();
        playBtn.textContent = 'Pause';
        playBtn2.textContent = '❚❚';
    } else {
        audio.pause();
        playBtn.textContent = 'Play';
        playBtn2.textContent = '▶';
    }
}

function playFromList(el) {
    const index = items.indexOf(el);
    if (index !== -1) {
        loadTrack(index);
        audio.play();
        playBtn.textContent = 'Pause';
        playBtn2.textContent = '❚❚';
    }
}

function nextSong() {
    let idx = (currentIndex + 1) % playlist.length;
    loadTrack(idx);
    audio.play();
}
function prevSong() {
    let idx = (currentIndex - 1 + playlist.length) % playlist.length;
    loadTrack(idx);
    audio.play();
}

audio.addEventListener('timeupdate', () => {
    const pct = (audio.currentTime / (audio.duration || 1)) * 100;
    progressFill.style.width = pct + '%';
    miniProgress.style.width = pct + '%';
    currentTimeEl.innerText = formatTime(audio.currentTime);
    durationEl.innerText = isNaN(audio.duration) ? '0:00' : formatTime(audio.duration);
    miniTime.innerText = formatTime(audio.currentTime) + ' / ' + (isNaN(audio.duration) ? '0:00' : formatTime(audio.duration));
});

audio.addEventListener('ended', () => {
    nextSong();
});

function formatTime(t) {
    if (!t || isNaN(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, '0');
    return m + ':' + s;
}

// click on progress to seek
function seek(e) {
    const bar = document.getElementById('progressBar');
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    audio.currentTime = pct * (audio.duration || 0);
}

// initialize first track
if (playlist.length) loadTrack(0);

// optional: simple search filter for sidebar items
document.getElementById('searchInput').addEventListener('input', function () {
    const q = this.value.toLowerCase();
    items.forEach(it => {
        const text = it.innerText.toLowerCase();
        it.style.display = text.includes(q) ? 'flex' : 'none';
    });
});

// placeholders for shuffle/repeat (to extend)
function toggleShuffle() { alert('Shuffle: tính năng demo - bạn có thể implement sau.'); }
function toggleRepeat() { alert('Repeat: tính năng demo - bạn có thể implement sau.'); }