import { create } from 'zustand';

interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  audio: string;
}

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playlist: Track[];
  isShuffling: boolean;
  repeatMode: 0 | 1 | 2; // 0 = No repeat, 1 = Repeat album, 2 = Repeat song
  mute: boolean;
  setTrack: (track: Track) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void; // Toggle repeat between 0, 1, 2
  toggleMute: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  addTrackToPlaylist: (track: Track) => void; // Acción para agregar canciones
  removeTrackFromPlaylist: (trackId: string) => void; // Acción para eliminar canciones

  // Funciones para manejar la billetera personalizada
  connectWallet: () => void; // Conectar la billetera
  disconnectWallet: () => void; // Desconectar la billetera
  walletAddress: string | null; // Dirección de la billetera
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 1,
  currentTime: 0,
  duration: 0,
  mute: false,
  isShuffling: false,
  repeatMode: 0,
  playlist: [
    {
      id: '1',
      title: 'Cyberpunk Dreams',
      artist: 'Digital Nomad',
      cover: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909',
      audio: 'https://example.com/audio1.mp3'
    },
    {
      id: '2',
      title: 'Blockchain Beats',
      artist: 'Crypto Collective',
      cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
      audio: 'https://example.com/audio2.mp3'
    }
  ],
  walletAddress: null, // Sin billetera conectada inicialmente

  // Funciones del reproductor
  setTrack: (track) => set({ currentTrack: track }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (volume) => set({ volume }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  toggleShuffle: () => set((state) => ({ isShuffling: !state.isShuffling })),
  toggleRepeat: () => {
    const { repeatMode } = get();
    const nextRepeatMode = (repeatMode + 1) % 3 as 0 | 1 | 2;
    set({ repeatMode: nextRepeatMode });
  },
  toggleMute: () => set((state) => ({ mute: !state.mute })),

  nextTrack: () => {
    const { currentTrack, playlist, isShuffling, repeatMode } = get();
    if (!currentTrack) return;

    let nextTrack: Track;
    const currentIndex = playlist.findIndex((track) => track.id === currentTrack.id);

    if (isShuffling) {
      nextTrack = playlist[Math.floor(Math.random() * playlist.length)];
    } else {
      if (repeatMode === 1) {
        nextTrack = playlist[(currentIndex + 1) % playlist.length]; // Repite el álbum
      } else if (repeatMode === 2) {
        nextTrack = currentTrack; // Repite la canción actual
      } else {
        nextTrack = playlist[currentIndex + 1] || playlist[0]; // Canción siguiente
      }
    }

    set({ currentTrack: nextTrack });
  },

  prevTrack: () => {
    const { currentTrack, playlist } = get();
    if (!currentTrack) return;

    const currentIndex = playlist.findIndex((track) => track.id === currentTrack.id);
    const prevTrack = playlist[currentIndex - 1] || playlist[playlist.length - 1];
    set({ currentTrack: prevTrack });
  },

  // Nuevas funciones para modificar la lista de reproducción
  addTrackToPlaylist: (track) => set((state) => ({ playlist: [...state.playlist, track] })),
  removeTrackFromPlaylist: (trackId) => set((state) => ({
    playlist: state.playlist.filter(track => track.id !== trackId)
  })),

  // Implementación de la billetera personalizada
  connectWallet: () => {
    // Aquí iría la lógica para conectar tu billetera personalizada
    // Ejemplo: conectar a tu billetera, recibir dirección, etc.
    const mockAddress = "0x1234567890abcdef"; // Dirección mock
    set({ walletAddress: mockAddress });
    console.log("Billetera conectada: ", mockAddress);
  },

  disconnectWallet: () => {
    // Lógica para desconectar la billetera
    set({ walletAddress: null });
    console.log("Billetera desconectada");
  },
}));
