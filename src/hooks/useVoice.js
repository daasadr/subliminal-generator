import { useState } from 'react';
import { generateSpeech } from '../services/elevenLabsService';

export const useVoice = () => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAudio = async (text, voiceId) => {
    setIsGenerating(true);

    try {
      const blob = await generateSpeech(text, voiceId);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setAudioBlob(blob);
      return blob;  // Vracíme blob pro použití v LayerControls
    } catch (error) {
      console.error('Error:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    audioUrl,
    audioBlob,
    isGenerating,
    generateAudio
  };
};