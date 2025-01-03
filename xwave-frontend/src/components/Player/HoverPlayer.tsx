import React, { useState } from "react";
import BottomNavBar from "../BottomNavBar/BottomNavBar";

// Implementación del hook usePlayer
function usePlayer() {
  const [playerState, setPlayerState] = useState({
    title: "",
    artist: "",
    contentType: "",
    src: "",
  });

  const playContent = (title: string, artist: string | undefined, src: string, contentType: "audio" | "video") => {
    setPlayerState({
      title,
      artist: artist || "Unknown Artist",
      src,
      contentType,
    });
  };

  return { playerState, playContent };
}

const HoverPlayer: React.FC = () => {
  const { playerState, playContent } = usePlayer();
  const [hoveredContent, setHoveredContent] = useState<"audio" | "video" | null>(null);

  // Datos de ejemplo
  const mockContent = {
    audio: {
      title: "Chill Beats",
      artist: "Lofi Artist",
      src: "https://example.com/audio.mp3",
      contentType: "audio" as const,
    },
    video: {
      title: "Nature Documentary",
      artist: undefined,
      src: "https://example.com/video.mp4",
      contentType: "video" as const,
    },
  };

  const handleHover = (contentType: "audio" | "video") => {
    setHoveredContent(contentType);
    const content = mockContent[contentType];
    playContent(content.title, content.artist, content.src, content.contentType);
  };

  return (
    <div>
      <BottomNavBar
        onNavigateToSettings={() => { throw new Error("Function not implemented."); }}
        onNavigateToProfile={() => { throw new Error("Function not implemented."); }}
        onNavigateToAccount={() => { throw new Error("Function not implemented."); }}
        onLogout={() => { throw new Error("Function not implemented."); }}
        onConnectWallet={() => { throw new Error("Function not implemented."); }}
      />
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "50px" }} />

      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "50px" }}>
        {/* Botón de música */}
        <div
          onMouseEnter={() => handleHover("audio")}
          onMouseLeave={() => setHoveredContent(null)}
          style={{
            position: "relative",
            padding: "10px",
            backgroundColor: "#ddd",
            borderRadius: "5px",
            cursor: "pointer",
            textAlign: "center",
            transition: "transform 0.3s ease",
          }}
        >
          Music
          {hoveredContent === "audio" && (
            <div
              style={{
                position: "absolute",
                top: "120%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "250px",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                animation: "fadeIn 0.3s ease",
                zIndex: 1000,
              }}
            >
              <h4 style={{ margin: 0 }}>Audio Player</h4>
              <p style={{ margin: "5px 0" }}>
                Now Playing: {playerState.title || "Unknown Track"}
              </p>
              <p style={{ margin: "5px 0" }}>
                Artist: {playerState.artist || "Unknown Artist"}
              </p>
            </div>
          )}
        </div>

        {/* Botón de video */}
        <div
          onMouseEnter={() => handleHover("video")}
          onMouseLeave={() => setHoveredContent(null)}
          style={{
            position: "relative",
            padding: "10px",
            backgroundColor: "#ddd",
            borderRadius: "5px",
            cursor: "pointer",
            textAlign: "center",
            transition: "transform 0.3s ease",
          }}
        >
          Video
          {hoveredContent === "video" && (
            <div
              style={{
                position: "absolute",
                top: "120%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "250px",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                animation: "fadeIn 0.3s ease",
                zIndex: 1000,
              }}
            >
              <h4 style={{ margin: 0 }}>Video Player</h4>
              <p style={{ margin: "5px 0" }}>
                Now Playing: {playerState.title || "Unknown Video"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HoverPlayer;
