import { Home as HomeIcon, User as UserIcon, Settings as SettingsIcon, LogOut as LogOutIcon, LogIn as LogInIcon, Wallet as WalletIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext'; // Usamos el contexto de autenticación
import SearchBar from './SearchBar';

interface BottomNavBarProps {
  onNavigateToSettings: () => void;
  onNavigateToProfile: () => void;
  onNavigateToAccount: () => void;
  onConnectWallet: () => void; // Nueva función para conectar la billetera
  onLogout: () => void; // Nueva función para el logout
  value: string;
  onChange: (newValue: string) => void;
  placeholder: string;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({
  onNavigateToSettings,
  onNavigateToProfile,
  onNavigateToAccount,
  onConnectWallet, // Usamos la nueva función
  onLogout, // Agregamos el onLogout aquí
  
}) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(''); // Guardamos el valor de búsqueda
  const { isSignedIn, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  const handleLogin = () => {
    if (!isSignedIn) {
      signIn('test@example.com', 'password123');
    }
  };

  const handleLogoutInternal = () => {
    if (isSignedIn) {
      signOut();
      setIsSidebarVisible(false);
      navigate('/explore');
    }
  };

  useEffect(() => {
    if (!isSignedIn) {
      console.log('El usuario ha cerrado sesión');
    }
  }, [isSignedIn]);

  const handleNavigate = (route: string) => {
    navigate(route);
    setIsSidebarVisible(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const handleLogoutConfirmation = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      handleLogoutInternal();
      onLogout(); // Llamamos a la función onLogout
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="bottom-nav-bar bg-[#1d475f] flex justify-center items-center p-4 fixed bottom-0 left-0 right-0 z-50">
      <div className="nav-content flex justify-between w-full max-w-4xl">
        <div className="flex items-center space-x-4">
          <button
            className="nav-button text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#3ecadd] transition-all transform hover:scale-105"
            onClick={toggleSidebar}
            aria-label="Open user menu"
            aria-expanded={isSidebarVisible ? 'true' : 'false'}
          >
            <UserIcon size={24} />
          </button>
        </div>

        {isSignedIn ? (
          <div className="flex items-center space-x-4">
            <button
              className="nav-button text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#3ecadd] transition-all transform hover:scale-105"
              onClick={onConnectWallet} // Acción para conectar la billetera
              aria-label="Connect wallet"
            >
              <WalletIcon size={24} />
            </button>
          </div>
        ) : (
          <div className="flex space-x-4">
            <button
              className="nav-button text-white w-24 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#3ecadd] transition-all transform hover:scale-105"
              onClick={handleLogin}
              aria-label="Sign in"
            >
              <LogInIcon size={20} />
              Sign In
            </button>
            <button
              className="nav-button text-white w-24 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#3ecadd] transition-all transform hover:scale-105"
              onClick={() => navigate('/signup')}
              aria-label="Sign up"
            >
              Sign Up
            </button>
          </div>
        )}

        <div className="flex-grow mx-4">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            onSearch={(query) => navigate(`/search?query=${query}`)}
          />
        </div>

        <button
          className={`nav-button text-white w-16 h-16 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#3ecadd] transition-all transform hover:scale-105 ${isActive('/') ? 'bg-[#3ecadd]' : ''}`}
          aria-label="Go to home"
          onClick={() => handleNavigate('/')}
        >
          <HomeIcon size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`sidebar bg-[#1d475f] text-white fixed left-0 w-full sm:w-64 transition-all ${isSidebarVisible ? 'bottom-16' : '-bottom-full'}`}
        style={{
          overflowX: 'hidden',
          height: 'auto',
          transition: 'top 0.3s ease-in-out',
        }}
      >
        <div style={{ padding: '10px', textAlign: 'center' }}>
          <h2 className="text-xl">User Menu</h2>
        </div>
        <ul style={{ listStyle: 'none', padding: '10px' }}>
          <li style={{ padding: '10px 0' }}>
            <button
              onClick={onNavigateToSettings}
              style={{
                color: 'white',
                textDecoration: 'none',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
              }}
              aria-label="Settings"
            >
              <SettingsIcon size={18} /> Settings
            </button>
          </li>
          <li style={{ padding: '10px 0' }}>
            <button
              onClick={onNavigateToProfile}
              style={{
                color: 'white',
                textDecoration: 'none',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
              }}
              aria-label="Profile"
            >
              Profile
            </button>
          </li>
          <li style={{ padding: '10px 0' }}>
            <button
              onClick={onNavigateToAccount}
              style={{
                color: 'white',
                textDecoration: 'none',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
              }}
              aria-label="Account"
            >
              Account
            </button>
          </li>
          <li style={{ padding: '10px 0' }}>
            <button
              onClick={handleLogoutConfirmation}
              style={{
                color: 'white',
                textDecoration: 'none',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
              }}
              aria-label="Logout"
            >
              <LogOutIcon size={18} /> Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BottomNavBar;
