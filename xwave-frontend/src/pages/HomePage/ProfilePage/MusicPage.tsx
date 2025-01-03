// MusicPage.tsx
import React, { useState } from "react";
import MusicPlayer from "../../../components/Player/Player";
import BottomNavBar from "../../../components/BottomNavBar/BottomNavBar";

const MusicPage: React.FC = () => {
  const [selectedSong, setSelectedSong] = useState<number | null>(null);
  const [playerState, setPlayerState] = useState({
    contentType: "audio",
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    mute: false,
    isShuffle: false,
    isRepeat: false,
    title: "",
    artist: "",
    src: "",
    cover: ""
  });

  const songs = [
    {
      title: "Chill Beats",
      artist: "Lofi Artist",
      src: "https://example.com/audio1.mp3",
      cover: "https://example.com/cover1.jpg",
    },
    {
      title: "Relaxing Vibes",
      artist: "Lofi Beats",
      src: "https://example.com/audio2.mp3",
      cover: "https://example.com/cover2.jpg",
    },
    {
      title: "Study Playlist",
      artist: "Focus Music",
      src: "https://example.com/audio3.mp3",
      cover: "https://example.com/cover3.jpg",
    },
  ];

  const handleSelectSong = (index: number) => {
    setSelectedSong(index);
    const song = songs[index];
    setPlayerState({
      ...playerState,
      isPlaying: true,
      title: song.title,
      artist: song.artist,
      src: song.src,
      cover: song.cover
    });
  };

  const handlePlayPause = () => {
    setPlayerState(prevState => ({
      ...prevState,
      isPlaying: !prevState.isPlaying
    }));
  };

  const handleStop = () => {
    setPlayerState(prevState => ({
      ...prevState,
      isPlaying: false,
      currentTime: 0,
      src: "",
      title: "",
      artist: "",
      cover: ""
    }));
    setSelectedSong(null);
  };

  const handleShuffle = () => {
    setPlayerState(prevState => ({
      ...prevState,
      isShuffle: !prevState.isShuffle
    }));
  };

  const handleRepeat = () => {
    setPlayerState(prevState => ({
      ...prevState,
      isRepeat: !prevState.isRepeat
    }));
  };

  const handleVolumeChange = (volume: number) => {
    setPlayerState(prevState => ({
      ...prevState,
      volume: volume
    }));
  };

  const handleMute = () => {
    setPlayerState(prevState => ({
      ...prevState,
      mute: !prevState.mute
    }));
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Player en la parte superior */}
      <div className="flex-shrink-0 bg-gray-800 p-4 border-b border-gray-600 min-h-[80px]">
        {selectedSong !== null && playerState.contentType === "audio" && (
          <MusicPlayer
            src={playerState.src}
            trackTitle={playerState.title}
            artistName={playerState.artist}
            coverImage={playerState.cover}
            isPlaying={playerState.isPlaying}
            currentTime={playerState.currentTime}
            duration={playerState.duration}
            volume={playerState.volume}
            mute={playerState.mute}
            isShuffle={playerState.isShuffle}
            isRepeat={playerState.isRepeat}
            togglePlayPause={handlePlayPause}
            onStop={handleStop}
            toggleShuffle={handleShuffle}
            toggleRepeat={handleRepeat}
            setVolume={handleVolumeChange}
            toggleMute={handleMute}
          />
        )}
      </div>

      {/* Lista de canciones */}
      <div className="flex-grow p-4 overflow-y-auto bg-gray-100">
        {songs.map((song, index) => (
          <div
            key={index}
            onClick={() => handleSelectSong(index)}
            className={`flex items-center mb-4 cursor-pointer ${selectedSong === index ? "bg-gray-300" : ""}`}
          >
            <img src={song.cover} alt={song.title} className="w-16 h-16 mr-4 rounded" />
            <div className="flex flex-col">
              <h4 className="font-bold">{song.title}</h4>
              <p className="text-gray-600">{song.artist}</p>
            </div>
          </div>
        ))}
      </div>

      {/* BottomNavBar */}
      <BottomNavBar onNavigateToSettings={function (): void {
        throw new Error("Function not implemented.");
      } } onNavigateToProfile={function (): void {
        throw new Error("Function not implemented.");
      } } onNavigateToAccount={function (): void {
        throw new Error("Function not implemented.");
      } } onLogout={function (): void {
        throw new Error("Function not implemented.");
      } } onConnectWallet={function (): void {
        throw new Error("Function not implemented.");
      } } value={""} onChange={function (_newValue: string): void {
        throw new Error("Function not implemented.");
      } } placeholder={""} />
    </div>
  );
};

export default MusicPage;
