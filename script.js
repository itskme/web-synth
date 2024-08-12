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
    { key: 'z', note: '1', frequency: 60 },
    { key: 'x', note: '2', frequency: 80 },
    { key: 'c', note: '3', frequency: 100 },
    { key: 'v', note: '4', frequency: 120 },
    { key: 'b', note: '5', frequency: 140 },
    { key: 'n', note: '6', frequency: 160 },
    { key: 'm', note: '7', frequency: 180 },
];

const audioContext = new AudioContext();

const gainNode = audioContext.createGain();
gainNode.gain.value = 0.5;
gainNode.connect(audioContext.destination);

const keyboardContainer = document.getElementById('keyboard');
const waveTypeButton = document.getElementById('wave-type-button');
const pitchShiftBox = document.getElementById('pitch-shift-box');

let currentWaveType = 'square';
let waveTypes = ['sine', 'square', 'sawtooth', 'triangle'];
let currentWaveTypeIndex = 0;
let pitchShift = 0;

const drumSamples = {};

notes.forEach((note) => {
    if (note.note.match(/^\d+$/)) {
        drumSamples[note.note] = `${note.note}.wav`;
    }
});

notes.forEach((note) => {
    const key = document.createElement('div');
    key.className = 'key';
    key.textContent = note.key.toUpperCase();
    if (note.note in drumSamples) {
        key.addEventListener('click', () => playDrum(note.note));
    } else {
        key.addEventListener('click', () => playNote(note.frequency));
    }
    keyboardContainer.appendChild(key);
});

document.addEventListener('keydown', (event) => {
    const note = notes.find((note) => note.key === event.key);
    if (note) {
        if (note.note in drumSamples) {
            playDrum(note.note);
        } else {
            playNote(note.frequency);
        }
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
        oscillator.type = currentWaveType;
        oscillator.frequency.value = frequency + pitchShift;
        oscillator.connect(gainNode);
        oscillator.start();
        oscillators[frequency] = oscillator;
    } else {
        oscillators[frequency].frequency.value = frequency + pitchShift;
    }
}

function stopNote(frequency) {
    if (oscillators[frequency]) {
        oscillators[frequency].stop();
        delete oscillators[frequency];
    }
}

function playDrum(note) {
    const audio = new Audio(drumSamples[note]);
    audio.play();
}

waveTypeButton.addEventListener('click', () => {
    currentWaveTypeIndex = (currentWaveTypeIndex + 1) % waveTypes.length;
    currentWaveType = waveTypes[currentWaveTypeIndex];
    waveTypeButton.textContent = `Wave Type: ${currentWaveType}`;
});

pitchShiftBox.addEventListener('mousemove', (event) => {
    const rect = pitchShiftBox.getBoundingClientRect();
    const mouseY = event.clientY - rect.top;
    const height = rect.height;
    pitchShift = (mouseY / height) * 100 - 50;
    Object.values(oscillators).forEach((oscillator) => {
        oscillator.frequency.value = oscillator.frequency.value - pitchShift;
    });
});

pitchShiftBox.addEventListener('mouseleave', () => {
    pitchShift = 0;
    Object.values(oscillators).forEach((oscillator) => {
        oscillator.frequency.value = oscillator.frequency.value - pitchShift;
    });
});