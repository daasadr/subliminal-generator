import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAffirmations } from '../../hooks/useAffirmatons';

export const AffirmationInput = () => {
  const { mode } = useApp();
  const { generate, validate } = useAffirmations();
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (mode === 'ai') {
      await generate(input);
    } else {
      await validate(input.split('\n'));
    }
  };

  return (
    <div className="input-section">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={
          mode === 'ai'
            ? "Zadejte svůj cíl... (např. 'Chci být sebevědomější v práci')"
            : 'Zadejte své afirmace (každou na nový řádek)'
        }
      />
      <button onClick={handleSubmit}>
        {mode === 'ai' ? 'Generovat afirmace' : 'Potvrdit'}
      </button>
    </div>
  );
};