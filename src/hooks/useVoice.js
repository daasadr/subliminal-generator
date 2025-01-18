import { useState } from 'react';

export const useVoice = () => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generateAudio = async (text, voiceId, settings = {}) => {
    setIsGenerating(true);
    setError(null);

    try {
      const audioBlob = await generateSpeech(text, voiceId, {
        ...settings,
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.5,
        use_speaker_boost: true
      });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      return url;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    audioUrl,
    isGenerating,
    error,
    generateAudio
  };
};