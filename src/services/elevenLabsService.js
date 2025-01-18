export const generateSpeech = async (text, voiceId, apiKey) => {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error('Failed to generate speech');
  }

  return await response.blob();
};

export const fetchVoices = async () => {
  const response = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: {
      'xi-api-key': import.meta.env.VITE_ELEVENLABS_API_KEY
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch voices');
  }
  
  const data = await response.json();
  return data.voices;
};
