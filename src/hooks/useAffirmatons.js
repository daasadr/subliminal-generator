import { useState } from 'react';
import { generateAffirmations, validateAffirmations } from '../services/claudeService';
import { useApp } from '../context/AppContext';

export const useAffirmations = () => {
  const { setAffirmations, setSuggestions, setIsLoading } = useApp();
  const [error, setError] = useState(null);

  const generate = async (goal) => {
    setIsLoading(true);
    try {
      const result = await generateAffirmations(goal);
      setAffirmations(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const validate = async (customAffirmations) => {
    setIsLoading(true);
    try {
      const result = await validateAffirmations(customAffirmations);
      if (result.status === 'suggestions') {
        setSuggestions(result.suggestions);
      } else if (result.status === 'ok') {
        setAffirmations(customAffirmations);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { generate, validate, error };
};