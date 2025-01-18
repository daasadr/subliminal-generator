export const AudioPlayer = ({ audioUrl }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = 'afirmace.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="audio-player">
      <audio controls>
        <source src={audioUrl} type="audio/mpeg" />
        Váš prohlížeč nepodporuje přehrávání audia.
      </audio>
      <button onClick={handleDownload} className="download-btn">
        Stáhnout audio
      </button>
    </div>
  );
};