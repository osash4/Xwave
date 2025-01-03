import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase-config';

export const register = (email: string, password: string): Promise<void> => {
  return createUserWithEmailAndPassword(auth, email, password).then(() => {});
};

export const login = (email: string, password: string): Promise<void> => {
  return signInWithEmailAndPassword(auth, email, password).then(() => {});
};

export const logout = (): Promise<void> => {
  return signOut(auth);
};
