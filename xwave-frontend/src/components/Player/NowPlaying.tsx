import React from 'react';

interface NowPlayingProps {
  trackTitle: string;
  artistName: string;
  coverImage: string;
  albumLink?: string;
  artistLink?: string;
  currentTime: number;
  duration: number;
}

const NowPlaying: React.FC<NowPlayingProps> = ({
  trackTitle,
  artistName,
  coverImage,
  albumLink,
  artistLink,
}) => {
  return (
    <div
      data-testid="now-playing-widget"
      className="now-playing-widget flex items-center justify-between p-4 bg-gray-800 text-white rounded-lg shadow-md"
      role="contentinfo"
      aria-live="polite"
      aria-label={`Now playing: ${trackTitle} by ${artistName}`}
    >
      {/* Cover Image */}
      <div
        data-testid="CoverSlotCollapsed__container"
        className="cover-slot-container flex-shrink-0"
      >
        <div draggable="true">
          <button
            type="button"
            data-testid="cover-art-button"
            className="cover-art-button relative rounded overflow-hidden w-14 h-14"
            aria-label="Now playing view"
          >
            <img
              src={coverImage}
              alt="Album cover"
              className="cover-image w-full h-full object-cover"
              aria-hidden="false"
              draggable="false"
              loading="eager"
            />
          </button>
        </div>
      </div>

      {/* Track and Artist Info */}
      <div className="track-info flex flex-col flex-grow px-4">
        <div className="track-title-container">
          <a
            href={albumLink || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="track-title font-semibold truncate hover:underline"
            aria-label={`Link to ${trackTitle} album`}
          >
            {trackTitle}
          </a>
        </div>
        <div className="artist-name-container">
          <a
            href={artistLink || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="artist-name text-sm truncate hover:underline"
            aria-label={`Link to ${artistName} profile`}
          >
            {artistName}
          </a>
        </div>
      </div>

      {/* Add to Liked Songs Button */}
      <button
        className="like-button rounded-full p-2 hover:bg-gray-700 text-white bg-transparent border bordder-gray-300"
        aria-checked="false"
        aria-label="Add to Liked Songs"
        data-encore-id="buttonTertiary"
      >
        <svg
          data-encore-id="icon"
          role="img"
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="icon w-5 h-5 fill-current text-white"
        >
          <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path>
          <path d="M11.75 8a.75.75 0 0 1-.75.75H8.75V11a.75.75 0 0 1-1.5 0V8.75H5a.75.75 0 0 1 0-1.5h2.25V5a.75.75 0 0 1 1.5 0v2.25H11a.75.75 0 0 1 .75.75z"></path>
        </svg>
      </button>
    </div>
  );
};

export default NowPlaying;
