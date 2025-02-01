// src/types/global.d.ts

declare global {
    interface XWaveAPI {
      [x: string]: any;
      getAccounts: () => Promise<string[]>;  // Ajusta este tipo según los métodos de tu billetera
      connect: () => void;
      }

      interface Window {
        XWaveAPI: XWaveAPI;
      }
    }
  
  
  console.log('Global types loaded')

  export {};
  