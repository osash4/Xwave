import React from 'react';
import { Hero } from '../../components/Hero';  // Componente Hero
import { Features } from '../../components/Features';  // Componente Features
import { Footer } from '../../components/Footer';  // Componente Footer

const HomePage: React.FC = () => (
  <div className="min-h-screen bg-[#11263a] font-['Poppins']">
  
    {/* Sección principal de bienvenida */}
    <Hero />

    {/* Sección de características destacadas */}
    <Features />

    {/* Sección del pie de página */}
    <Footer />
  </div>
);

export default HomePage;
