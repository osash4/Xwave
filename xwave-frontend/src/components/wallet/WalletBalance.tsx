import React, { useState, useEffect } from "react";

// Actualiza la interfaz para incluir tanto walletAddress como balance
interface WalletBalanceProps {
  walletAddress: string | null;  // La dirección de la billetera
  balance: number;  // Propiedad balance agregada
}

export const WalletBalance: React.FC<WalletBalanceProps> = ({ walletAddress, balance }) => {
  const [formattedBalance, setFormattedBalance] = useState<string>("");

  useEffect(() => {
    if (walletAddress) {
      console.log(`Wallet address: ${walletAddress}`); // Mostrar la dirección de la billetera
    }
    // Aquí podrías formatear el balance o hacer más cálculos si es necesario
    setFormattedBalance(balance.toLocaleString());  // Formateo de balance
  }, [balance]);  // Solo actualizar cuando el balance cambie

  return (
    <div>
      <h3>Wallet Balance:</h3>
      {formattedBalance ? (
        <p>{formattedBalance} Tokens</p> 
      ) : (
        <p>Cargando...</p> 
      )}
    </div>
  );
};
