export class AudioService {
    audioContext: AudioContext | null;
    analyzerNode: AnalyserNode | null;
    gainNode: GainNode | null;
    sourceNode: AudioBufferSourceNode | null;

    constructor() {
        this.audioContext = null;
        this.analyzerNode = null;
        this.gainNode = null;
        this.sourceNode = null;
    }

    async initialize() {
        try {
            const AudioContextClass = (window.AudioContext ||
                (window as any).webkitAudioContext) as typeof AudioContext;

            this.audioContext = new AudioContextClass();

            this.analyzerNode = this.audioContext.createAnalyser();
            this.analyzerNode.fftSize = 2048;

            this.gainNode = this.audioContext.createGain();

            this.analyzerNode.connect(this.gainNode);
            this.gainNode.connect(this.audioContext.destination);

            return true;
        } catch (error) {
            console.error('Failed to initialize audio context:', error);
            return false;
        }
    }

    async createAudioSource(file: File) {
        if (!this.audioContext) return false;

        try {
            const arrayBuffer = await file.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

            this.sourceNode = this.audioContext.createBufferSource();
            this.sourceNode.buffer = audioBuffer;

            if (this.analyzerNode) {
                this.sourceNode.connect(this.analyzerNode);
            }

            return true;
        } catch (error) {
            console.error('Failed to create audio source:', error);
            return false;
        }
    }

    getAnalyzerData() {
        if (!this.analyzerNode) return null;

        const bufferLength = this.analyzerNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyzerNode.getByteFrequencyData(dataArray);

        return dataArray;
    }

    play() {
        if (this.sourceNode && this.audioContext) {
            this.sourceNode.start(0);
        }
    }

    stop() {
        if (this.sourceNode) {
            this.sourceNode.stop();
            this.sourceNode = null;
        }
    }

    setVolume(value: number) {
        if (this.gainNode) {
            this.gainNode.gain.value = value;
        }
    }
}