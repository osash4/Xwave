import React, { useEffect, useRef } from 'react';

const CanvasComponent: React.FC = () => {
  // Referencia al canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Asegúrate de que el canvas esté cargado
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Ahora puedes usar el contexto para dibujar en el canvas
        // Aquí usas getByteFrequencyData, por ejemplo para un espectro de audio
        const audioData = new Uint8Array(256);  // Solo un ejemplo, tu implementación puede ser diferente
        // Por ejemplo, si tienes un analyserNode de Web Audio API, lo usas así:
        // analyserNode.getByteFrequencyData(audioData);

        // Limpiar el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Aquí empieza el dibujo de tus datos de frecuencia
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < audioData.length; i++) {
          const barHeight = audioData[i];
          ctx.fillStyle = `rgb(${barHeight}, 50, 50)`;
          ctx.fillRect(i * 3, canvas.height - barHeight, 2, barHeight);  // Dibuja las barras del espectro
        }
      } else {
        console.error('No se pudo obtener el contexto 2D del canvas');
      }
    } else {
      console.error('El canvas no está cargado correctamente');
    }
  }, []); // Se ejecuta una vez cuando el componente se monta

  return (
    <canvas ref={canvasRef} width="600" height="400">
      Tu navegador no soporta Canvas.
    </canvas>
  );
};

export default CanvasComponent;
