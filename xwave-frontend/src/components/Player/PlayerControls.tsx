import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import { cn } from '../../lib/utils';
import { useBlockchain } from '../../contexts/BlockchainContext'; // Asegúrate de importar el contexto

interface PlayerControlsProps {
  isPlaying: boolean;
  togglePlay: () => void;
  prevTrack: () => void;
  nextTrack: () => void;
  currentTime: number;
  duration: number;
  progress:  number;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  onStop: () => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = () => {
  const { 
    isPlaying, 
    togglePlay, 
    nextTrack, 
    prevTrack, 
    currentTime, 
    duration, 
    toggleShuffle, 
    toggleRepeat, 
    setCurrentTime, 
    isShuffling, 
    repeatMode, 
  } = usePlayerStore();

  const { connect, disconnect, blockchain } = useBlockchain(); // Usamos el contexto para obtener el objeto blockchain y sus métodos

  const [progress, setProgress] = useState(currentTime);
  const [repeat, setRepeat] = useState<0 | 1 | 2>(repeatMode);

  useEffect(() => {
    setProgress(currentTime);
  }, [currentTime]);

  useEffect(() => {
    const audio = document.querySelector('audio');
    if (audio) {
      if (repeat === 1) {
        audio.onended = () => {
          audio.currentTime = 0;
          audio.play();
        };
      } else if (repeat === 2) {
        audio.onended = () => {
          nextTrack();
        };
      } else {
        audio.onended = null;
      }
    }
  }, [repeat, nextTrack]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setProgress(newTime);
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleRepeatMode = () => {
    let newRepeat: 0 | 1 | 2 = 0;
    if (repeat === 0) newRepeat = 1;
    else if (repeat === 1) newRepeat = 2;
    setRepeat(newRepeat);
    toggleRepeat();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full max-w-sm mx-auto">
      {/* Sección de conexión a blockchain */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={connect} // Conectarse a la blockchain
          className="p-1 text-white hover:text-[#3ecadd] transition-colors"
        >
          Conectar a Blockchain
        </button>
        <button
          onClick={disconnect} // Desconectarse de la blockchain
          className="p-1 text-white hover:text-[#3ecadd] transition-colors"
        >
          Desconectar
        </button>
      </div>

      <div className="flex items-center gap-2 ">
        {/* Botón Shuffle */}
        <button
          onClick={toggleShuffle}
          className="p-1 text-white hover:text-[#3ecadd] transition-colors"
        >
          <Shuffle size={16} className={isShuffling ? "text-[#3ecadd]" : "text-gray-500"} />
        </button>
        
        {/* Botón Previous */}
        <button
          onClick={prevTrack}
          className="p-1 text-white hover:text-[#3ecadd] transition-colors"
        >
          <SkipBack size={20} />
        </button>

        {/* Botón Play/Pause */}
        <button
          onClick={togglePlay}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            "hover:bg-[#3ecadd] transition-all",
            "transform hover:scale-105"
          )}
        >
          {isPlaying ? <Pause size={26} /> : <Play size={26} />}
        </button>

        {/* Botón Next */}
        <button
          onClick={nextTrack}
          className="p-1 text-white hover:text-[#3ecadd] transition-colors"
        >
          <SkipForward size={20} />
        </button>

        {/* Botón Repeat */}
        <button
          onClick={toggleRepeatMode}
          className={cn(
            "p-1 text-white hover:text-[#3ecadd] transition-colors",
            repeat === 0 ? "text-gray-500" : "text-[#3ecadd]"
          )}
        >
          <Repeat size={16} />
        </button>
      </div>

      {/* Barra de Tiempo */}
      <div className="flex items-center gap-2 w-full mb-1">
        <span className="text-white text-xs">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration}
          step="0.01"
          value={progress}
          onChange={handleSeek}
          className="w-[80vw] h-1 bg-[#407188] rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-white text-xs">{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default PlayerControls;
