// Sound utility for playing sound effects in the lab
let audioContext: AudioContext | null = null;

// Initialize audio context on first user interaction
const initAudioContext = () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
};

// Play a simple beep sound
export const playBeep = (frequency = 440, duration = 0.1) => {
    initAudioContext();
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gainNode.gain.value = 0.1;

    oscillator.start();
    setTimeout(() => {
        oscillator.stop();
    }, duration * 1000);
};

// Play a bubbling sound effect
export const playBubblesSound = () => {
    initAudioContext();
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = 220 + Math.random() * 440;
    gainNode.gain.value = 0.05;

    oscillator.start();
    setTimeout(() => {
        oscillator.stop();
    }, 0.2 * 1000);
};

// Play a chemical reaction sound
export const playReactionSound = () => {
    initAudioContext();
    if (!audioContext) return;

    // Create a more complex sound with multiple oscillators
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator1.type = 'sine';
    oscillator1.frequency.value = 330;
    oscillator2.type = 'sine';
    oscillator2.frequency.value = 440;

    gainNode.gain.value = 0.1;

    oscillator1.start();
    oscillator2.start();

    setTimeout(() => {
        oscillator1.stop();
        oscillator2.stop();
    }, 0.3 * 1000);
};

// Play a reset sound
export const playResetSound = () => {
    initAudioContext();
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = 220;
    gainNode.gain.value = 0.1;

    oscillator.start();
    setTimeout(() => {
        oscillator.stop();
    }, 0.5 * 1000);
};