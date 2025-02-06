import React, { useState } from 'react';
import { VoiceSelector } from './VoiceSelector';
import { LayerControls } from './LayerControls';
import { AudioPlayer } from './AudioPlayer';
import { useVoice } from '../../hooks/useVoice';
import { useApp } from '../../context/AppContext';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const AudioControls = () => {
  const { affirmations } = useApp();
  const { audioUrl, audioBlob, isGenerating, generateAudio } = useVoice();
  const [selectedVoiceId, setSelectedVoiceId] = useState(''); // Přidáno

  const handleGenerateAudio = async () => {
    if (!affirmations?.length || !selectedVoiceId) return;
    
    try {
      const audioBlob = await generateAudio(
        affirmations.join('. '),
        selectedVoiceId
      );
      
      return audioBlob;
    } catch (error) {
      console.error('Error generating audio:', error);
    }
  };

  return (
    <div className="audio-controls mt-8">
      <VoiceSelector
        selectedVoice={selectedVoiceId}
        onVoiceSelect={setSelectedVoiceId}
      />
      
      <button
        onClick={handleGenerateAudio}
        disabled={!affirmations?.length || !selectedVoiceId || isGenerating}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 mt-4"
      >
        {isGenerating ? 'Generuji...' : 'Generovat audio'}
      </button>

      {isGenerating && <LoadingSpinner />}
      
      {audioUrl && (
        <>
          <AudioPlayer audioUrl={audioUrl} />
          <LayerControls audioBlob={audioBlob} /> {/* Opraveno */}
        </>
      )}
    </div>
  );
};