import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;  // Cambia `any` por un tipo más específico si sabes la estructura del usuario
    }
  }
}
