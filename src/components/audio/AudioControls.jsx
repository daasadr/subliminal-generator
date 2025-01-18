import { useState } from 'react';
import { VoiceSelector } from './VoiceSelector';
import { AudioPlayer } from './AudioPlayer';
import { useVoice } from '../../hooks/useVoice';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const AudioControls = () => {
  const { affirmations } = useApp();
  const { audioUrl, isGenerating, generateAudio } = useVoice();
  const [selectedVoiceId, setSelectedVoiceId] = useState('');
  const [voiceSettings, setVoiceSettings] = useState({
    rate: 0.9,
    pitch: 1.0
  });

  const handleGenerateAudio = async () => {
    if (!affirmations.length || !selectedVoiceId) return;

    try {
      await generateAudio(
        affirmations.join('. '),
        selectedVoiceId,
        voiceSettings
      );
    } catch (error) {
      console.error('Error generating audio:', error);
      alert('Pokus o generování audia selhal');
    }
  };

  return (
    <div className="audio-controls mt-8">
      <VoiceSelector
        selectedVoice={selectedVoiceId}
        onVoiceSelect={setSelectedVoiceId}
        voiceSettings={voiceSettings}
        onSettingsChange={setVoiceSettings}
      />
      
      <Button
        onClick={handleGenerateAudio}
        disabled={!affirmations.length || !selectedVoiceId || isGenerating}
        variant="primary"
      >
        Přehrát afirmace
      </Button>

      {isGenerating && <LoadingSpinner />}
      
      {audioUrl && <AudioPlayer audioUrl={audioUrl} />}
    </div>
  );
};
