import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Search, Library, Heart, Music, Video, Gamepad, ShoppingCart } from 'lucide-react';
import BottomNavBar from '../../../components/BottomNavBar/BottomNavBar';
import { ContentSection } from '../../../components/ContentSection';
import './ProfilePage.css'; // Asegúrate de tener este archivo con los estilos base.
import HoverPlayer from '../../../components/Player/HoverPlayer';
import {WalletDashboard} from '../../../components/wallet/WalletDashboard'; // Asegúrate de importar el WalletDashboard

interface ContentItems {
  [key: string]: string[];
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const profilePageItems: ContentItems = {
    "Your Library": ["Content Item 1", "Content Item 2", "Content Item 3"],
    "Liked Content": ["Liked Item 1", "Liked Item 2", "Liked Item 3"],
    "Recommendations": ["Rec Item 1", "Rec Item 2", "Rec Item 3"],
    "Recently Played": ["Played Item 1", "Played Item 2", "Played Item 3"]
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleContentClick = (_trackTitle: string) => {
    // Aquí puedes manejar lo que sucede al hacer clic en un contenido, si es necesario.
  };

  return (
    <div className="profile-page flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Contenedor principal */}
      <div className="main-container flex-1 flex flex-row overflow-hidden">
        {/* Contenido principal */}
        <div className="content-area flex-1 p-6 mt-4">
          <div className="banner mb-6 bg-gray-800 p-6 rounded-lg shadow-xl text-center">
            <h1 className="text-3xl font-bold">Welcome to Your Profile</h1>
          </div>

          {/* Wallet Dashboard (debajo del banner) */}
          <div className="wallet-dashboard mb-6">
            <WalletDashboard /> {/* Aquí va el componente WalletDashboard */}
          </div>

          {/* HoverPlayer */}
          <div className="hover-player-container mb-6">
            <HoverPlayer />
          </div>

          {/* Secciones de contenido */}
          <div className="content-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Object.keys(profilePageItems).map((title) => (
              <ContentSection
                key={title}
                title={title}
                items={profilePageItems[title]}
                onItemClick={handleContentClick}
              />
            ))}
          </div>
        </div>

        {/* Barra lateral derecha */}
        <div className="sidebar w-28 bg-[#1d475f] p-4 shadow-xl flex flex-col">
          <div className="sidebar-items flex flex-col mt-6 space-y-4">
            <div onClick={() => navigate('/home')} className="sidebar-item flex items-center cursor-pointer">
              <Home className="text-2xl text-white" />
            </div>
            <div onClick={() => navigate('/search')} className="sidebar-item flex items-center cursor-pointer">
              <Search className="text-2xl text-white" />
            </div>
            <div onClick={() => navigate('/library')} className="sidebar-item flex items-center cursor-pointer">
              <Library className="text-2xl text-white" />
            </div>
            <div onClick={() => navigate('/liked')} className="sidebar-item flex items-center cursor-pointer">
              <Heart className="text-2xl text-white" />
            </div>
            <div onClick={() => navigate('/music')} className="sidebar-item flex items-center cursor-pointer">
              <Music className="text-2xl text-white" />
            </div>
            <div onClick={() => navigate('/video')} className="sidebar-item flex items-center cursor-pointer">
              <Video className="text-2xl text-white" />
            </div>
            <div onClick={() => navigate('/gaming')} className="sidebar-item flex items-center cursor-pointer">
              <Gamepad className="text-2xl text-white" />
            </div>
            <div onClick={() => navigate('/marketplace')} className="sidebar-item flex items-center cursor-pointer">
              <ShoppingCart className="text-2xl text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNavBar
        onNavigateToSettings={() => navigate('/settings')}
        onNavigateToProfile={() => navigate('/profile')}
        onNavigateToAccount={() => navigate('/account')}
        onLogout={handleLogout}
        onConnectWallet={() => { } } value={''} onChange={function (_newValue: string): void {
          throw new Error('Function not implemented.');
        } } placeholder={''}      />
    </div>
  );
};

export default ProfilePage;
