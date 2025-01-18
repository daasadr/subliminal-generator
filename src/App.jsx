import React from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/layout/Header';
import { AffirmationInput } from './components/affirmations/AffirmationInput';
import { AffirmationsList } from './components/affirmations/AffirmationsList';
import { AudioControls } from './components/audio/AudioControls';

export default function App() {
  return (
    <AppProvider>
      <div className="app max-w-4xl mx-auto p-4">
        <Header />
        <main>
          <AffirmationInput />
          <AffirmationsList />
          <AudioControls />
        </main>
      </div>
    </AppProvider>
  );
}