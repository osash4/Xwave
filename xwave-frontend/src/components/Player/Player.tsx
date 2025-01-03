import React, { useRef, useEffect } from "react";
import PlayerControls from "./PlayerControls";
import VolumeControl from "./VolumeControl";
import NowPlaying from "./NowPlaying";

interface MusicPlayerProps {
  src: string;
  trackTitle: string;
  artistName: string;
  coverImage: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  mute: boolean;
  togglePlayPause: () => void;
  onStop: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  isShuffle: boolean;
  isRepeat: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  src,
  trackTitle,
  artistName,
  coverImage,
  isPlaying,
  currentTime,
  duration,
  volume,
  mute,
  togglePlayPause,
  onStop,
  toggleShuffle,
  toggleRepeat,
  setVolume,
  toggleMute,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.src = src; // Configurar la fuente de audio
      audio.volume = mute ? 0 : volume; // Ajustar el volumen

      if (isPlaying) {
        audio
          .play()
          .catch((error) => console.error("Error al reproducir el audio:", error));
      } else {
        audio.pause();
      }
    }
  }, [src, isPlaying, volume, mute]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      const current = audio.currentTime;
      const totalDuration = audio.duration;

      console.log(`Tiempo actual: ${current}, Duración total: ${totalDuration}`);
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) {
      console.log(`Duración del audio: ${audio.duration}`);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      }
    };
  }, []);

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
      {/* Controles de Volumen */}
      <div className="flex-1 flex items-center justify-start">
        <VolumeControl volume={volume} mute={mute} setVolume={setVolume} toggleMute={toggleMute} />
      </div>

      {/* Controles del Reproductor */}
      <div className="flex-2 flex items-center justify-center">
        <PlayerControls
          isPlaying={isPlaying}
          togglePlay={togglePlayPause}
          onStop={onStop}
          toggleShuffle={toggleShuffle}
          toggleRepeat={toggleRepeat}
          currentTime={currentTime}
          duration={duration} prevTrack={function (): void {
            throw new Error("Function not implemented.");
          } } nextTrack={function (): void {
            throw new Error("Function not implemented.");
          } } progress={0}        />
      </div>

      {/* Información de la canción */}
      <div className="flex-1 flex items-center justify-end">
        <NowPlaying
          trackTitle={trackTitle}
          artistName={artistName}
          coverImage={coverImage} currentTime={0} duration={0}        />
      </div>

      {/* Etiqueta de audio oculta */}
      <audio ref={audioRef} />
    </div>
  );
};

export default MusicPlayer;
