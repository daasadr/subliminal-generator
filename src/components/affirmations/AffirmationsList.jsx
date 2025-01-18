import { useApp } from '../../context/AppContext';
import { useAffirmations } from '../../hooks/useAffirmatons';

export const AffirmationsList = () => {
  const { affirmations, suggestions, mode } = useApp();
  const { applySuggestions } = useAffirmations();

  if (!affirmations?.length && !suggestions?.length) return null;

  return (
    <div className="affirmations-container">
      <div className="affirmations">
        {affirmations.map((aff, index) => (
          <p key={index} className="affirmation">{aff}</p>
        ))}
      </div>
      
      {suggestions && (
        <div className="suggestions">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="suggestion-item">
              <p className="original">Původní: {suggestion.original}</p>
              <p className="suggested">Návrh: {suggestion.suggested}</p>
              <p className="reason">{suggestion.reason}</p>
            </div>
          ))}
          <button onClick={applySuggestions}>Aplikovat navrhované úpravy</button>
        </div>
      )}
    </div>
  );
};