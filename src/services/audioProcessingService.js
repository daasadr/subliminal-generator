export class AudioMixer {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.layers = new Map(); // Uložení všech audio vrstev
    this.backgroundTrack = null;
    this.masterGainNode = this.audioContext.createGain();
    this.masterGainNode.connect(this.audioContext.destination);
  }

  async createAudioLayer(audioBuffer, settings) {
    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = audioBuffer;
    source.playbackRate.value = settings.speed;
    gainNode.gain.value = settings.volume;

    source.connect(gainNode);
    gainNode.connect(this.masterGainNode);

    return { source, gainNode };
  }

  async processAffirmation(audioBlob, settings) {
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    
    // Převede požadovanou délku na vzorky, bere v úvahu rychlost přehrávání
    const durationInMinutes = settings.duration;
    const durationInSamples = Math.floor(durationInMinutes * 60 * this.audioContext.sampleRate);
    const speedAdjustedLength = Math.floor(durationInSamples * settings.speed); 
    
    const repeatedBuffer = this.audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      speedAdjustedLength,
      this.audioContext.sampleRate
    );

    // Pro každý kanál
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const inputData = audioBuffer.getChannelData(channel);
      const outputData = repeatedBuffer.getChannelData(channel);

    // Upraví délku jedné iterace podle rychlosti
      const iterationLength = Math.floor(inputData.length / settings.speed);
      let outputPosition = 0;

      // Kopíruje data dokud nenaplníme celý buffer
      while (outputPosition < speedAdjustedLength) {
        const remainingSpace = speedAdjustedLength - outputPosition;
        const bytesToCopy = Math.min(iterationLength, remainingSpace);
    
    // Interpoluje vzorky podle rychlosti
        for (let i = 0; i < bytesToCopy; i++) {
          const inputIndex = Math.floor(i * settings.speed);
          if (inputIndex < inputData.length) {
            outputData[outputPosition + i] = inputData[inputIndex];
          }
        }
        
        outputPosition += bytesToCopy;
      }
    }

    return repeatedBuffer;
  }

  async exportMix(duration) {
    const offlineContext = new OfflineAudioContext(
      2, // Stereo
      this.audioContext.sampleRate * duration * 60, // Délka v samples
      this.audioContext.sampleRate
    );

    // Přidáme všechny vrstvy do offline kontextu
    for (const [id, layer] of this.layers.entries()) {
      const source = offlineContext.createBufferSource();
      const gain = offlineContext.createGain();
      
      source.buffer = layer.source.buffer;
      source.loop = true; // Zapneme smyčku
      source.playbackRate.value = layer.source.playbackRate.value;
      gain.gain.value = layer.gainNode.gain.value;
      
      source.connect(gain);
      gain.connect(offlineContext.destination);
      source.start(0);
    }

    // Vyrenderujeme finální mix
    const renderedBuffer = await offlineContext.startRendering();

    // Převedeme na WAV
    return this.audioBufferToWav(renderedBuffer);
  }

  // Pomocná funkce pro převod AudioBuffer na WAV
  audioBufferToWav(buffer) {
    const numberOfChannels = buffer.numberOfChannels;
    const length = buffer.length * numberOfChannels * 2; // 2 byty na vzorek
    const outputBuffer = new ArrayBuffer(44 + length); // 44 bytů WAV header
    const view = new DataView(outputBuffer);
    const sampleRate = buffer.sampleRate;
    const channels = buffer.numberOfChannels;

    /* RIFF identifier */
    this.writeString(view, 0, 'RIFF');
    /* file length */
    view.setUint32(4, 36 + length, true);
    /* RIFF type */
    this.writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    this.writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, channels, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * channels * 2, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, channels * 2, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    this.writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, length, true);

    const channelData = [];
    // Interleave channels
    for (let i = 0; i < channels; i++) {
      channelData[i] = buffer.getChannelData(i);
    }

    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < channels; channel++) {
        const sample = channelData[channel][i];
        // Convert float32 to int16
        const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(offset, int16, true);
        offset += 2;
      }
    }

    return new Blob([outputBuffer], { type: 'audio/wav' });
  }

  writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}