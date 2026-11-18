// Simple Web Audio API Synthesizer for Relaxing Ambient Sounds (No external MP3 files needed)
class AmbientSoundEngine {
  constructor() {
    this.ctx = null;
    this.currentTrack = null;
    this.nodes = [];
    this.gainNode = null;
    this.isPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  play(trackId, volume = 0.5) {
    this.init();
    this.stop();

    this.currentTrack = trackId;
    this.isPlaying = true;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(volume * 0.35, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    if (trackId === 'rain') {
      this.createRainEffect();
    } else if (trackId === 'waves') {
      this.createWavesEffect();
    } else if (trackId === 'forest') {
      this.createWindEffect();
    } else if (trackId === 'night') {
      this.createHealingFrequency();
    }
  }

  createRainEffect() {
    // Generate pink noise buffer
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to simulate soft raindrops hitting surfaces
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.gainNode);
    whiteNoise.start(0);

    this.nodes.push(whiteNoise, filter);
  }

  createWavesEffect() {
    // Sine-modulated pink noise for ocean surge
    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.08;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // 8-second wave period
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(260, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(this.gainNode);

    lfo.start(0);
    noise.start(0);
    this.nodes.push(noise, filter, lfo, lfoGain);
  }

  createWindEffect() {
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(35, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    osc.connect(this.gainNode);
    lfo.start(0);
    osc.start(0);
    this.nodes.push(osc, lfo, lfoGain);
  }

  createHealingFrequency() {
    // 432 Hz Solfeggio soothing sound
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(432, this.ctx.currentTime);

    const sub = this.ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(216, this.ctx.currentTime);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    osc.connect(this.gainNode);
    sub.connect(subGain);
    subGain.connect(this.gainNode);

    osc.start(0);
    sub.start(0);
    this.nodes.push(osc, sub, subGain);
  }

  setVolume(volume) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(volume * 0.35, this.ctx.currentTime);
    }
  }

  stop() {
    this.nodes.forEach((n) => {
      try {
        if (n.stop) n.stop();
        if (n.disconnect) n.disconnect();
      } catch {
        // Ignored
      }
    });
    this.nodes = [];
    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch {
        // Ignored
      }
      this.gainNode = null;
    }
    this.isPlaying = false;
    this.currentTrack = null;
  }
}

export const soundEngine = new AmbientSoundEngine();

