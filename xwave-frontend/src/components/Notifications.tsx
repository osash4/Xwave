import React, { useState } from "react";

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

export const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setVisible(false), 5000); // Desaparece después de 5 segundos
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  let notificationClass = '';
  switch (type) {
    case 'success':
      notificationClass = 'bg-green-500 text-white';
      break;
    case 'error':
      notificationClass = 'bg-red-500 text-white';
      break;
    case 'info':
      notificationClass = 'bg-blue-500 text-white';
      break;
    default:
      notificationClass = 'bg-gray-500 text-white';
  }

  return (
    <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-lg shadow-lg ${notificationClass}`}>
      <p>{message}</p>
    </div>
  );
};
function useEffect(_arg0: () => (() => void) | undefined, _arg1: any[]) {
    throw new Error("Function not implemented.");
}

