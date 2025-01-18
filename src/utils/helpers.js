export const formatAudioDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const sanitizeText = (text) => {
  return text.trim().split('\n').filter(line => line.trim());
};