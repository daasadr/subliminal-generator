import { useState, useEffect } from 'react';
import { AudioMixer } from '../services/audioProcessingService';

export const useAudioMixer = () => {
  const [mixer, setMixer] = useState(null);

  useEffect(() => {
    setMixer(new AudioMixer());
  }, []);

  const addLayer = async (audioBlob, settings) => {
    if (!mixer) return;
    await mixer.addLayer(audioBlob, settings);
  };

  const removeLayer = (id) => {
    if (!mixer) return;
    mixer.layers.delete(id);
  };

  const playMix = () => {
    if (!mixer) return;
    mixer.play();
  };

  const exportMix = async (duration) => {
    if (!mixer) return;
    const mixBlob = await mixer.exportMix(duration);
    const url = URL.createObjectURL(mixBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mix.wav';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    addLayer,
    removeLayer,
    playMix,
    exportMix
  };
};