//i used AI for drfining the notes. I aint gonna do this myself!
const notes = [
    { key: 'a', note: 'C4', frequency: 261.63 },
    { key: 'w', note: 'C#4', frequency: 277.18 },
    { key: 's', note: 'D4', frequency: 293.66 },
    { key: 'e', note: 'D#4', frequency: 311.13 },
    { key: 'd', note: 'E4', frequency: 329.63 },
    { key: 'f', note: 'F4', frequency: 349.23 },
    { key: 't', note: 'F#4', frequency: 369.99 },
    { key: 'g', note: 'G4', frequency: 392.00 },
    { key: 'y', note: 'G#4', frequency: 415.30 },
    { key: 'h', note: 'A4', frequency: 440.00 },
    { key: 'u', note: 'A#4', frequency: 466.16 },
    { key: 'j', note: 'B4', frequency: 493.88 },
    { key: 'k', note: 'C5', frequency: 523.25 },
    { key: 'i', note: 'C#5', frequency: 554.37 },
    { key: 'l', note: 'D5', frequency: 587.33 },
    { key: 'o', note: 'D#5', frequency: 622.25 },
    { key: 'p', note: 'E5', frequency: 659.26 },
    { key: ';', note: 'F5', frequency: 698.46 },
    { key: '[', note: 'F#5', frequency: 739.99 },
    { key: ']', note: 'G5', frequency: 783.99 },
    { key: '\\', note: 'G#5', frequency: 830.61 },
    { key: '1', note: 'A5', frequency: 880.00 },
    { key: '2', note: 'A#5', frequency: 932.33 },
    { key: '3', note: 'B5', frequency: 987.77 },
    { key: '4', note: 'C6', frequency: 1046.50 },
    { key: '5', note: 'C#6', frequency: 1108.73 },
    { key: '6', note: 'D6', frequency: 1174.66 },
    { key: '7', note: 'D#6', frequency: 1244.51 },
    { key: '8', note: 'E6', frequency: 1318.51 },
    { key: '9', note: 'F6', frequency: 1396.91 },
    { key: '0', note: 'F#6', frequency: 1479.98 },
];

const audioContext = new AudioContext();

const gainNode = audioContext.createGain();
gainNode.gain.value = 0.5;
gainNode.connect(audioContext.destination);

const keyboardContainer = document.getElementById('keyboard');


notes.forEach((note) => {
    const key = document.createElement('div');
    key.className = 'key';
    key.textContent = note.key.toUpperCase();
    key.addEventListener('click', () => playNote(note.frequency));
    keyboardContainer.appendChild(key);
});

document.addEventListener('keydown', (event) => {
    const note = notes.find((note) => note.key === event.key);
    if (note) {
        playNote(note.frequency);
    }
});


document.addEventListener('keyup', (event) => {
    const note = notes.find((note) => note.key === event.key);
    if (note) {
        stopNote(note.frequency);
    }
});

const oscillators = {};


function playNote(frequency) {

    if (!oscillators[frequency]) {
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.value = frequency;
        oscillator.connect(gainNode);
        oscillator.start();
        oscillators[frequency] = oscillator;
    }
}
