const track_list = [
  {
    name: "First Song",
    artist: "THAMAN",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTksPqePmm7YEKYXWRAokaCcxsSpyr4HTuhlQ&s",
    path: "audio/song1.mp3"
  },
  {
    name: "Second Song",
    artist: "ANIRUDH",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrFAJdcKlQxHri90BJyMe2lQ4TyI-1gHEtcA&s",
    path: "audio/song2.mp3"
  },
  {
    name: "Third Song",
    artist: "ANIRUDH",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTYt-R58k_xVhvWjcZJx5hN_89h9e86pGHyQ&s",
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

audio.addEventListener('error', () => {
  alert("Error loading audio file. Please check the file paths.");
});

function loadTrack(index) {
  clearInterval(updateTimer);
  resetValues();
  audio.src = track_list[index].path;
  audio.load();

  trackArt.style.backgroundImage = `url('${track_list[index].image}')`;
  trackName.textContent = track_list[index].name;
  trackArtist.textContent = track_list[index].artist;

  nowPlaying.textContent = `PLAYING ${index + 1} OF ${track_list.length}`;

  updateTimer = setInterval(seekUpdate, 1000);

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
  audio.play()
    .then(() => {
      isPlaying = true;
      playBtn.innerHTML = `<i class="fa fa-pause-circle fa-4x"></i>`;
    })
    .catch(e => {
      console.error("Playback prevented:", e);
    });
}

function pauseTrack() {
  audio.pause();
  isPlaying = false;
  playBtn.innerHTML = `<i class="fa fa-play-circle fa-4x"></i>`;
}

function nextTrack() {
  currentTrack = (currentTrack + 1) % track_list.length;
  loadTrack(currentTrack);
  playTrack();
}

function prevTrack() {
  currentTrack = (currentTrack - 1 + track_list.length) % track_list.length;
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

function seekUpdate() {
  if (!isNaN(audio.duration)) {
    let seekPosition = audio.currentTime * (100 / audio.duration);
    seekSlider.value = seekPosition;

    let currentMins = Math.floor(audio.currentTime / 60);
    let currentSecs = Math.floor(audio.currentTime % 60);
    let durationMins = Math.floor(audio.duration / 60);
    let durationSecs = Math.floor(audio.duration % 60);

    currentTimeEl.textContent =
      `${currentMins < 10 ? '0' + currentMins : currentMins}:` +
      `${currentSecs < 10 ? '0' + currentSecs : currentSecs}`;

    totalDurationEl.textContent =
      `${durationMins < 10 ? '0' + durationMins : durationMins}:` +
      `${durationSecs < 10 ? '0' + durationSecs : durationSecs}`;

    trackDuration.textContent = totalDurationEl.textContent;
  }
}

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
    };
    playlistSongs.appendChild(li);
  });
}

autoplayCheckbox.addEventListener('change', function () {
  autoplayEnabled = this.checked;
});

audio.addEventListener('ended', function () {
  if (autoplayEnabled) nextTrack();
  else pauseTrack();
});

playBtn.addEventListener('click', playpauseTrack);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);
seekSlider.addEventListener('input', seekTo);
volumeSlider.addEventListener('input', setVolume);

renderPlaylist();
loadTrack(currentTrack);
setVolume();
