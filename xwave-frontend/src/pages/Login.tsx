import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext'; // Asegúrate de que la ruta esté bien
import { FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';
import { BsWallet2 } from 'react-icons/bs';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signIn, isSignedIn } = useAuth(); // Accede a isAuthenticated

  // Redirige a la página de perfil si el usuario ya está autenticado
  useEffect(() => {
    // Verifica si el usuario está autenticado y no está ya en la página de perfil
    if (isSignedIn) {
      navigate('/profile'); // Redirige al perfil si está autenticado
    }
  }, [isSignedIn, navigate]); // Asegúrate de que se ejecute solo cuando isSignedIn cambie

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Usa la función signIn del contexto para autenticar al usuario
      await signIn(email, password);
      navigate('/profile'); // Redirige a /profile después del login exitoso
    } catch (err: any) {
      setError('Invalid email or password'); // Mensaje de error
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // Implementar la lógica de login con proveedores sociales
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#11263a] to-[#1e3a5f] text-white">
      <div className="bg-[#407188] p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        {error && <p className="text-red-400 mb-4">{error}</p>} {/* Mostrar error */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-[#0d2333] text-white border border-[#1c4d6b] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-[#0d2333] text-white border border-[#1c4d6b] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#1d475f] hover:bg-[#1c4d6b] py-2 px-4 rounded-full text-white font-semibold transition-all duration-300"
          >
            Sign In
          </button>
        </form>

        <div className="my-6 border-t border-[#1c4d6b]"></div>

        <button
          onClick={() => handleSocialLogin('Google')}
          className="w-full flex items-center justify-center bg-transparent hover:bg-gradient-to-r from-red-600 to-red-700 border-2 border-red-600 text-red-600 hover:text-white py-2 px-4 rounded-full font-semibold transition-all duration-300 mb-4"
        >
          <FaGoogle className="mr-2" /> Sign in with Google
        </button>
        <button
          onClick={() => handleSocialLogin('Facebook')}
          className="w-full flex items-center justify-center bg-transparent hover:bg-gradient-to-r from-blue-800 to-blue-900 border-2 border-blue-800 text-blue-800 hover:text-white py-2 px-4 rounded-full font-semibold transition-all duration-300 mb-4"
        >
          <FaFacebook className="mr-2" /> Sign in with Facebook
        </button>
        <button
          onClick={() => handleSocialLogin('Apple')}
          className="w-full flex items-center justify-center bg-transparent hover:bg-gradient-to-r from-black to-gray-800 border-2 border-black text-black hover:text-white py-2 px-4 rounded-full font-semibold transition-all duration-300 mb-4"
        >
          <FaApple className="mr-2 text-xl" /> Sign in with Apple
        </button>

        <button
          onClick={() => handleSocialLogin('Wallet')}
          className="w-full flex items-center justify-center bg-transparent hover:bg-gradient-to-r from-green-600 to-green-700 border-2 border-green-600 text-green-600 hover:text-white py-2 px-4 rounded-full font-semibold transition-all duration-300"
        >
          <BsWallet2 className="mr-2 text-xl" /> Sign in with Wallet
        </button>

        <p className="mt-6 text-sm text-center">
          Don’t have an account?{' '}
          <a href="/register" className="text-blue-400 hover:underline">
            Register here
          </a>
        </p>

        <p className="mt-2 text-sm text-center">
          <a href="/forgot-password" className="text-blue-400 hover:underline">
            Forgot Password?
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
