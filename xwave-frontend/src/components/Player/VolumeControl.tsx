import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Eye, List, Maximize, Minimize2 } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  setVolume: (volume: number) => void;
  mute: boolean;
  toggleMute: () => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ volume, setVolume, mute, toggleMute }) => {
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Funciones de manejo
  const handleNowPlaying = () => {
    alert('Now Playing View');
  };

  const handleQueue = () => {
    alert('Queue Opened');
  };

  const toggleMiniPlayer = () => {
    setIsMiniPlayer(!isMiniPlayer);
    alert(`Mini Player ${!isMiniPlayer ? 'Opened' : 'Closed'}`);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    alert(`Fullscreen ${!isFullscreen ? 'Enabled' : 'Disabled'}`);
  };

  // Efecto para actualizar el estado de volumen y silenciar
  useEffect(() => {
    if (mute) {
      setVolume(0);
    }
  }, [mute, setVolume]);

  return (
    <div className="flex items-center gap-4 w-full">
      {/* Botones adicionales */}
      <button
        onClick={handleNowPlaying}
        className="p-2 text-white hover:text-[#3ecadd] transition-colors"
        aria-label="Now Playing"
      >
        <Eye size={20} />
      </button>
      <button
        onClick={handleQueue}
        className="p-2 text-white hover:text-[#3ecadd] transition-colors"
        aria-label="Queue"
      >
        <List size={20} />
      </button>

      {/* Control de volumen */}
      <div className="flex items-center gap-2 w-32">
        <button
          onClick={toggleMute}
          className="text-white hover:text-[#3ecadd] transition-colors"
          aria-label={mute ? 'Unmute' : 'Mute'}
        >
          {mute ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={mute ? 0 : volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-2 bg-[#407188] rounded-lg appearance-none cursor-pointer"
          aria-label="Volume"
        />
      </div>

      {/* Botones de Mini Player y Fullscreen */}
      <button
        onClick={toggleMiniPlayer}
        className="p-2 text-white hover:text-[#3ecadd] transition-colors"
        aria-label={isMiniPlayer ? 'Close Mini Player' : 'Open Mini Player'}
      >
        <Minimize2 size={20} />
      </button>
      <button
        onClick={toggleFullscreen}
        className="p-2 text-white hover:text-[#3ecadd] transition-colors"
        aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      >
        <Maximize size={20} />
      </button>
    </div>
  );
};

export default VolumeControl;
