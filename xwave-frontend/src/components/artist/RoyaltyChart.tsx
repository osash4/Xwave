// src/components/artist/RoyaltyChart.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';  // Usamos Chart.js para los gráficos
import { useTheme } from '../../contexts/ThemeContext';  // Si tienes el contexto de tema

interface RoyaltyData {
  timestamp: string | number | Date;
  amount: number;
}

interface RoyaltyChartProps {
  data: RoyaltyData[];
}

const RoyaltyChart: React.FC<RoyaltyChartProps> = ({ data }) => {
  const { isDarkMode } = useTheme();  // Para manejar el modo oscuro

  // Función para formatear la fecha
  const formatDate = (timestamp: string | number | Date): string => {
    return new Date(timestamp).toLocaleDateString();
  };

  // Función para formatear los valores de las regalías
  const formatValue = (value: number): string => {
    return `${value.toFixed(2)} tokens`;
  };

  // Preparación de los datos para Chart.js
  const chartData = {
    labels: data.map((item) => formatDate(item.timestamp)),  // Las fechas en el eje X
    datasets: [
      {
        label: 'Royalty Earnings',
        data: data.map((item) => item.amount),  // Las cantidades de regalías en el eje Y
        borderColor: isDarkMode ? 'rgba(75,192,192,1)' : 'rgba(75, 192, 192, 0.5)',  // Color del borde
        fill: false,  // No relleno debajo de la línea
        pointRadius: 4,  // Tamaño de los puntos en la línea
        pointHoverRadius: 8,  // Tamaño del punto al pasar el ratón
      },
    ],
  };

  const options = {
    scales: {
      y: {
        ticks: {
          callback: (tickValue: string | number) => {
            return formatValue(Number(tickValue));  // Asegúrate de convertirlo a número si es string
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-96">
      <h2>Royalties Graph</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export { RoyaltyChart };
