const notes = [
    { key: 'q', note: 'C4', frequency: 261.63 },
    { key: 'w', note: 'C#4', frequency: 277.18 },
    { key: 'e', note: 'D4', frequency: 293.66 },
    { key: 'r', note: 'D#4', frequency: 311.13 },
    { key: 't', note: 'E4', frequency: 329.63 },
    { key: 'y', note: 'F4', frequency: 349.23 },
    { key: 'u', note: 'F#4', frequency: 369.99 },
    { key: 'i', note: 'G4', frequency: 392.00 },
    { key: 'o', note: 'G#4', frequency: 415.30 },
    { key: 'p', note: 'A4', frequency: 440.00 },
    { key: 'a', note: 'A#4', frequency: 466.16 },
    { key: 's', note: 'B4', frequency: 493.88 },
    { key: 'd', note: 'C5', frequency: 523.25 },
    { key: 'f', note: 'C#5', frequency: 554.37 },
    { key: 'g', note: 'D5', frequency: 587.33 },
    { key: 'h', note: 'D#5', frequency: 622.25 },
    { key: 'j', note: 'E5', frequency: 659.26 },
    { key: 'k', note: 'F5', frequency: 698.46 },
    { key: 'l', note: 'F#5', frequency: 739.99 },
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

const keys = {};

const keyboardLayout = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

keyboardLayout.forEach((row, rowIndex) => {
    const rowContainer = document.createElement('div');
    rowContainer.className = 'row';
    keyboardContainer.appendChild(rowContainer);

    row.forEach((key) => {
        const note = notes.find((note) => note.key === key);
        if (note) {
            const keyElement = document.createElement('div');
            keyElement.className = 'key';
            keyElement.textContent = note.key.toUpperCase();
            if (note.note in drumSamples) {
                keyElement.addEventListener('click', () => playDrum(note.note));
            } else {
                keyElement.addEventListener('click', () => playNote(note.frequency));
            }
            rowContainer.appendChild(keyElement);
            keys[note.key] = keyElement;
        }
    });
});

document.addEventListener('keydown', (event) => {
    const note = notes.find((note) => note.key === event.key);
    if (note && !note.key.match(/^\d+$/)) {
        if (note.note in drumSamples) {
            playDrum(note.note);
        } else {
            playNote(note.frequency);
        }
        keys[note.key].classList.add('active');
    }
});

document.addEventListener('keyup', (event) => {
    const note = notes.find((note) => note.key === event.key);
    if (note && !note.key.match(/^\d+$/)) {
        stopNote(note.frequency);
        keys[note.key].classList.remove('active');
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


const destination = audioContext.createMediaStreamDestination();
gainNode.connect(destination);
const mediaStream = destination.stream;


const mediaRecorder = new MediaRecorder(mediaStream);


const recordedBlobs = [];


const recordButton = document.getElementById('record-button');


const clearButton = document.getElementById('clear-button');


let isRecording = false;


recordButton.addEventListener('click', () => {
    if (isRecording) {
        mediaRecorder.stop();
        console.log('Recording stopped');
        isRecording = false;
        recordButton.textContent = 'Record';
    } else {
        mediaRecorder.start();
        console.log('Recording started');
        isRecording = true;
        recordButton.textContent = 'Stop';
    }
});


clearButton.addEventListener('click', () => {
    recordedBlobs.length = 0;
    console.log('Recording cleared');
});


mediaRecorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
    }
};

mediaRecorder.onstop = () => {
    console.log('Recording stopped');
};


function playRecording() {
    if (recordedBlobs.length > 0) {
        const audioBlob = new Blob(recordedBlobs, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.loop = true;
        audio.play();
    } else {
       
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = 0; 
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillator.loop = true;
    }
}


const playButton = document.getElementById('play-button');


playButton.addEventListener('click', () => {
    playRecording();
});