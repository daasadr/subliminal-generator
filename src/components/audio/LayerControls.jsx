import React, { useState } from 'react';
import { useAudioMixer } from '../../hooks/useAudioMixer';

export const LayerControls = ({ audioBlob }) => {
  const [layers, setLayers] = useState([]);
  const [duration, setDuration] = useState(5); // 5, 10, nebo 30 minut
  const { addLayer, removeLayer, playMix, exportMix } = useAudioMixer();

  const handleAddLayer = () => {
    if (layers.length >= 3) return;

    const newLayer = {
      id: Date.now(),
      speed: 1,
      volume: 1,
      duration: duration
    };

    setLayers([...layers, newLayer]);
    addLayer(audioBlob, newLayer);
  };

  const handleLayerChange = (id, changes) => {
    const updatedLayers = layers.map(layer => {
      if (layer.id === id) {
        const updatedLayer = { ...layer, ...changes };
        // Aktualizujeme vrstvu v mixéru
        addLayer(audioBlob, {
          id: updatedLayer.id,
          speed: updatedLayer.speed,
          volume: updatedLayer.volume,
          duration
        });
        return updatedLayer;
      }
      return layer;
    });
    setLayers(updatedLayers);
  };

  const handleRemoveLayer = (id) => {
    removeLayer(id);
    setLayers(layers.filter(l => l.id !== id));
  };

  const handleExport = async () => {
    try {
      const mixBlob = await exportMix(duration);
      const url = URL.createObjectURL(mixBlob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `affirmations-${duration}min.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting mix:', error);
    }
  };

  return (
    <div className="layer-controls">
      <div className="duration-selector">
        <label>Délka nahrávky:</label>
        <select 
          value={duration} 
          onChange={(e) => setDuration(Number(e.target.value))}
        >
          <option value={5}>5 minut</option>
          <option value={10}>10 minut</option>
          <option value={30}>30 minut</option>
        </select>
      </div>

      <button 
        onClick={handleAddLayer}
        disabled={layers.length >= 3}
      >
        Přidat vrstvu
      </button>

      {layers.map((layer, index) => (
        <div key={layer.id} className="layer-settings">
          <h4>Vrstva {index + 1}</h4>
          
          <div className="speed-control">
            <label>Rychlost:</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={layer.speed}
              onChange={(e) => handleLayerChange(layer.id, {
                speed: parseFloat(e.target.value)
              })}
            />
            <span>{layer.speed}x</span>
          </div>

          <div className="volume-control">
            <label>Hlasitost:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={layer.volume}
              onChange={(e) => handleLayerChange(layer.id, {
                volume: parseFloat(e.target.value)
              })}
            />
            <span>{Math.round(layer.volume * 100)}%</span>
          </div>

          <button onClick={() => handleRemoveLayer(layer.id)}>
            Odstranit vrstvu
          </button>
        </div>
      ))}

      <div className="mix-controls">
        <button onClick={playMix}>Přehrát mix</button>
        <button onClick={handleExport}>Stáhnout mix</button>
      </div>
    </div>
  );
};