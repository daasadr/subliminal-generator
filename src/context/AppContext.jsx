import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [mode, setMode] = useState('ai'); // 'ai' nebo 'custom'
  const [affirmations, setAffirmations] = useState([]);
  const [suggestions, setSuggestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const value = {
    mode,
    setMode,
    affirmations,
    setAffirmations,
    suggestions,
    setSuggestions,
    isLoading,
    setIsLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);