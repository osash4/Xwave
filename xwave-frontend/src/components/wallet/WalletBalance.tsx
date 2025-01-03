// components/WalletBalance.tsx
import React, { useState, useEffect } from "react";

interface WalletBalanceProps {
  walletAddress: string | null;  // La dirección de la billetera
}

export const WalletBalance: React.FC<WalletBalanceProps> = ({ walletAddress }) => {
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (walletAddress) {
        try {
          // Aquí iría tu lógica personalizada para obtener el balance
          // En este caso, simularé la obtención de un balance con un valor ficticio
          setBalance("1000"); // Este es un valor ficticio para ilustración
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    fetchBalance();
  }, [walletAddress]); // Reejecutar la lógica si la dirección de la billetera cambia

  return (
    <div>
      <h3>Wallet Balance:</h3>
      {balance !== null ? (
        <p>{balance} Tokens</p> // Mostrar el balance
      ) : (
        <p>Cargando...</p> // Mostrar mensaje de carga
      )}
    </div>
  );
};
