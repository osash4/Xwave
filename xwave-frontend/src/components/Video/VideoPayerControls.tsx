// VideoPlayerControls.tsx
import React from 'react';

interface VideoPlayerControlsProps {
  isPlaying: boolean;
  togglePlayPause: () => void;
  handleFullscreen: () => void;
  currentTime: string;
  duration: string;
  toggleSubtitles: () => void;
}

const VideoPlayerControls: React.FC<VideoPlayerControlsProps> = ({
  isPlaying, 
  togglePlayPause, 
  handleFullscreen, 
  currentTime, 
  duration, 
  toggleSubtitles
}) => {
  return (
    <div className="video-controls flex justify-between items-center w-full">
      <div className="flex items-center gap-4">
        <button onClick={togglePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <span>{currentTime} / {duration}</span>
      </div>
      
      <div className="flex items-center gap-4">
        <button onClick={toggleSubtitles}>Subtitles</button>
        <button onClick={handleFullscreen}>Fullscreen</button>
      </div>
    </div>
  );
};

export default VideoPlayerControls;
