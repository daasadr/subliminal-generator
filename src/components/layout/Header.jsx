import { useApp } from '../../context/AppContext';

export const Header = () => {
  const { mode, setMode } = useApp();

  return (
    <header className="mb-8">
      <h1 className="text-2xl font-bold mb-4">Generátor sublimálních audionahrávek</h1>
      <div className="flex gap-4">
        <button
          onClick={() => setMode('ai')}
          className={`px-4 py-2 rounded ${
            mode === 'ai' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          AI Generování
        </button>
        <button
          onClick={() => setMode('custom')}
          className={`px-4 py-2 rounded ${
            mode === 'custom' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Vlastní afirmace
        </button>
      </div>
    </header>
  );
};