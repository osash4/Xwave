import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Maximize, Minimize2, SkipBack, SkipForward } from "lucide-react";
import VolumeControl from "../Player/VolumeControl";

interface VideoPlayerProps {
  src: string;
  title: string;
  thumbnail: string;
  subtitles?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title, thumbnail, subtitles }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  return (
    <div
      ref={playerRef}
      className="relative w-full h-full bg-black"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full"
        src={src}
        poster={thumbnail}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      >
        {subtitles && (
          <track kind="subtitles" src={subtitles} srcLang="en" label="English" default />
        )}
      </video>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        {/* Title */}
        <div className="text-white text-xl mb-2">{title}</div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-white text-sm">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => {
              const time = parseFloat(e.target.value);
              if (videoRef.current) videoRef.current.currentTime = time;
              setCurrentTime(time);
            }}
            className="w-full h-1 bg-gray-600 rounded-lg"
          />
          <span className="text-white text-sm">{formatTime(duration)}</span>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} aria-label="Play/Pause">
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button onClick={() => skip(-10)} aria-label="Rewind 10 seconds">
              <SkipBack size={24} />
            </button>
            <button onClick={() => skip(10)} aria-label="Forward 10 seconds">
              <SkipForward size={24} />
            </button>
            <VolumeControl volume={volume} setVolume={setVolume} mute={isMuted} toggleMute={() => setIsMuted(!isMuted)} />
          </div>
          <button onClick={toggleFullscreen} aria-label="Fullscreen">
            {isFullscreen ? <Minimize2 size={24} /> : <Maximize size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
