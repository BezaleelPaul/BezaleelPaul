class SpaceAudioSystem {
  private ctx: AudioContext | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private thrusterNoiseNode: AudioBufferSourceNode | null = null;
  private thrusterGain: GainNode | null = null;
  private isInitialized = false;
  private isMuted = true;

  private initContext() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public startAmbience() {
    if (this.isInitialized || typeof window === 'undefined') return;
    try {
      this.initContext();
      if (!this.ctx) return;

      // Deep space binaural drone
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.08, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, this.ctx.currentTime);

      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc1.type = 'sine';
      this.ambientOsc1.frequency.setValueAtTime(55, this.ctx.currentTime); // 55Hz (A1)

      this.ambientOsc2 = this.ctx.createOscillator();
      this.ambientOsc2.type = 'sawtooth';
      this.ambientOsc2.frequency.setValueAtTime(55.6, this.ctx.currentTime); // Slight binaural beat

      this.ambientOsc1.connect(filter);
      this.ambientOsc2.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOsc1.start();
      this.ambientOsc2.start();
      this.isInitialized = true;
    } catch {
      // Audio autoplay policy handled gracefully
    }
  }

  public setThruster(active: boolean, intensity = 1.0) {
    if (!this.ctx || this.isMuted) return;
    try {
      if (active) {
        if (!this.thrusterGain) {
          this.thrusterGain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(220, this.ctx.currentTime);
          filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

          // White noise buffer for engine rumble
          const bufferSize = this.ctx.sampleRate * 2;
          const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }

          this.thrusterNoiseNode = this.ctx.createBufferSource();
          this.thrusterNoiseNode.buffer = noiseBuffer;
          this.thrusterNoiseNode.loop = true;
          this.thrusterNoiseNode.connect(filter);
          filter.connect(this.thrusterGain);
          this.thrusterGain.connect(this.ctx.destination);
          this.thrusterNoiseNode.start();
        }
        this.thrusterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.thrusterGain.gain.linearRampToValueAtTime(0.08 * intensity, this.ctx.currentTime + 0.1);
      } else if (this.thrusterGain) {
        this.thrusterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.thrusterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.2);
      }
    } catch {
      // Ignore audio glitches
    }
  }

  public playTelemetryBeep(freq = 880) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // Handled
    }
  }

  public playWarpSwoosh() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.7);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.7);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.75);
    } catch {
      // Handled
    }
  }

  public toggleMute(): boolean {
    return this.setMuted(!this.isMuted);
  }

  public setMuted(muted: boolean): boolean {
    this.isMuted = muted;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.08, this.ctx.currentTime);
    }
    if (this.thrusterGain && this.ctx && this.isMuted) {
      this.thrusterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getMuted() {
    return this.isMuted;
  }
}

export const spaceAudio = new SpaceAudioSystem();
