import React from 'react';

const ShareButton: React.FC = () => {
  const handleShare = async () => {
    const shareData = {
      title: 'Explore on Xwave',
      text: 'Check out this amazing music, video, or gaming content on XWave!',
      url: window.location.href, // Usamos la URL actual para compartir
    };

    // Comprobamos si el navegador soporta la API de compartir
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        alert("Content shared!");
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Si la API de compartir no está disponible, mostramos un enlace copiable
      prompt('Copy this link to share:', shareData.url);
    }
  };

  return (
    <button onClick={handleShare} style={styles.button}>
      Share
    </button>
  );
};

const styles = {
  button: {
    backgroundColor: '#3ecadd',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default ShareButton;
