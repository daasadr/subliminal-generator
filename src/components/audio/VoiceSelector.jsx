import { useEffect, useState } from 'react';
import { fetchVoices } from '../../services/elevenLabsService';

export const VoiceSelector = ({ selectedVoice, onVoiceSelect }) => {
  const [voices, setVoices] = useState([]);
  const [voiceSettings, setVoiceSettings] = useState({
    rate: 0.9,
    pitch: 1.0
  });

  useEffect(() => {
    const loadVoices = async () => {
      try {
        const availableVoices = await fetchVoices();
        setVoices(availableVoices);
        if (availableVoices.length) {
          onVoiceSelect(availableVoices[0].voice_id);
        }
      } catch (error) {
        console.error('Failed to load voices:', error);
      }
    };
    loadVoices();
  }, [onVoiceSelect]);

  return (
    <div className="voice-controls">
      <div className="voice-selection">
        <label htmlFor="voiceSelect">Vyberte hlas:</label>
        <select
          id="voiceSelect"
          value={selectedVoice}
          onChange={(e) => onVoiceSelect(e.target.value)}
        >
          {voices.map(voice => (
            <option key={voice.voice_id} value={voice.voice_id}>
              {voice.name}
            </option>
          ))}
        </select>
      </div>
      <div className="voice-settings">
        <div className="setting">
          <label htmlFor="rateRange">Rychlost řeči:</label>
          <input
            type="range"
            id="rateRange"
            min="0.5"
            max="2"
            step="0.1"
            value={voiceSettings.rate}
            onChange={(e) => setVoiceSettings(prev => ({
              ...prev,
              rate: parseFloat(e.target.value)
            }))}
          />
          <span>{voiceSettings.rate}</span>
        </div>

        <div className="setting">
          <label htmlFor="pitchRange">Výška hlasu:</label>
          <input
            type="range"
            id="pitchRange"
            min="0.5"
            max="2"
            step="0.1"
            value={voiceSettings.pitch}
            onChange={(e) => setVoiceSettings(prev => ({
              ...prev,
              pitch: parseFloat(e.target.value)
            }))}
          />
          <span>{voiceSettings.pitch}</span>
        </div>
      </div>
    </div>
  );
};