import React from 'react';

export const AudioPlayer = ({ audioUrl }) => {
  if (!audioUrl) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = 'afirmace.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="audio-player mt-4 flex flex-col items-center gap-4">
      <audio 
        controls 
        className="w-full max-w-lg"
        src={audioUrl}
      >
        <source src={audioUrl} type="audio/mpeg" />
        Váš prohlížeč nepodporuje přehrávání audia.
      </audio>
      <button
        onClick={handleDownload}
        className="download-btn px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        Stáhnout audio
      </button>
    </div>
  );
};