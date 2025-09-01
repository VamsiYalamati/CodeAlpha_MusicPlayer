// main.js

const track_list = [
  {
    name: "First Song",
    artist: "Artist One",
    image: "https://source.unsplash.com/Qrspubmx6kE/640x360",
    path: "audio/song1.mp3"
  },
  {
    name: "Second Song",
    artist: "Artist Two",
    image: "https://source.unsplash.com/XbZgkZf6h34/640x360",
    path: "audio/song2.mp3"
  },
  {
    name: "Third Song",
    artist: "Artist Three",
    image: "https://source.unsplash.com/VuR7vh2yJtQ/640x360",
    path: "audio/song3.mp3"
  }
];

let currentTrack = 0;
let isPlaying = false;
let updateTimer;
let autoplayEnabled = false;

const audio = document.getElementById('audio-player');
const trackArt = document.querySelector('.track-art');
const trackName = document.querySelector('.track-name');
const trackArtist = document.querySelector('.track-artist');
const trackDuration = document.querySelector('.track-duration');
const playBtn = document.querySelector('.playpause-track');
const nextBtn = document.querySelector('.next-track');
const prevBtn = document.querySelector('.prev-track');
const seekSlider = document.querySelector('.seek_slider');
const volumeSlider = document.querySelector('.volume_slider');
const nowPlaying = document.querySelector('.now-playing');
const currentTimeEl = document.querySelector('.current-time');
const totalDurationEl = document.querySelector('.total-duration');
const playlistSongs = document.querySelector('.playlist-songs');
const autoplayCheckbox = document.querySelector('.autoplay-checkbox');

function loadTrack(index) {
  clearInterval(updateTimer);
  resetValues();
  audio.src = track_list[index].path;
  audio.load();

  trackArt.style.backgroundImage = `url('${track_list[index].image}')`;
  trackName.textContent = track_list[index].name;
  trackArtist.textContent = track_list[index].artist;

  nowPlaying.textContent = `PLAYING ${index+1} OF ${track_list.length}`;

  updateTimer = setInterval(seekUpdate, 1000);

  // Highlight current track in playlist
  document.querySelectorAll('.playlist-songs li').forEach((li, i) => {
    li.classList.toggle('active', i === index);
  });
}

function resetValues() {
  currentTimeEl.textContent = "00:00";
  totalDurationEl.textContent = "00:00";
  seekSlider.value = 0;
}

function playpauseTrack() {
  if (!isPlaying) playTrack();
  else pauseTrack();
}

function playTrack() {
  audio.play();
  isPlaying = true;
  playBtn.innerHTML = `<i class="fa fa-pause-circle fa-4x"></i>`;
}

function pauseTrack() {
  audio.pause();
  isPlaying = false;
  playBtn.innerHTML = `<i class="fa fa-play-circle fa-4x"></i>`;
}

function nextTrack() {
  if (currentTrack < track_list.length - 1) currentTrack++;
  else currentTrack = 0;
  loadTrack(currentTrack);
  playTrack();
}

function prevTrack() {
  if (currentTrack > 0) currentTrack--;
  else currentTrack = track_list.length - 1;
  loadTrack(currentTrack);
  playTrack();
}

function seekTo() {
  let seekTo = audio.duration * (seekSlider.value / 100);
  audio.currentTime = seekTo;
}

function setVolume() {
  audio.volume = volumeSlider.value / 100;
}

// Progress bar update
function seekUpdate() {
  let seekPosition = 0;
  if (!isNaN(audio.duration)) {
    seekPosition = audio.currentTime * (100 / audio.duration);
    seekSlider.value = seekPosition;

    let currentMins = Math.floor(audio.currentTime / 60);
    let currentSecs = Math.floor(audio.currentTime % 60);
    let durationMins = Math.floor(audio.duration / 60);
    let durationSecs = Math.floor(audio.duration % 60);

    currentTimeEl.textContent = `${currentMins<10 ? '0'+currentMins : currentMins}:${currentSecs<10 ? '0'+currentSecs : currentSecs}`;
    totalDurationEl.textContent = `${durationMins<10 ? '0'+durationMins : durationMins}:${durationSecs<10 ? '0'+durationSecs : durationSecs}`;
    trackDuration.textContent = totalDurationEl.textContent;
  }
}

// Playlist functions
function renderPlaylist() {
  playlistSongs.innerHTML = '';
  track_list.forEach((track, idx) => {
    const li = document.createElement('li');
    li.textContent = `${track.name} — ${track.artist}`;
    if (idx === currentTrack) li.classList.add('active');
    li.onclick = () => {
      currentTrack = idx;
      loadTrack(currentTrack);
      playTrack();
    }
    playlistSongs.appendChild(li);
  });
}

// Autoplay feature
autoplayCheckbox.addEventListener('change', function() {
  autoplayEnabled = this.checked;
});

// Track end event
audio.addEventListener('ended', function() {
  if (autoplayEnabled) nextTrack();
  else pauseTrack();
});

// UI button event listeners
playBtn.addEventListener('click', playpauseTrack);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);
seekSlider.addEventListener('change', seekTo);
volumeSlider.addEventListener('input', setVolume);

// Initialize
renderPlaylist();
loadTrack(currentTrack);
setVolume();
