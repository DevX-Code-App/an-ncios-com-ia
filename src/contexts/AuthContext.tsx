import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Subscription } from '../types';

interface AuthContextData {
  user: User | null;
  subscription: Subscription | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateSubscription: (sub: Subscription) => void;
  decrementCredits: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [storedUser, storedSub] = await Promise.all([
        AsyncStorage.getItem('@anuncialocal:user'),
        AsyncStorage.getItem('@anuncialocal:subscription')
      ]);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedSub) {
        setSubscription(JSON.parse(storedSub));
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    // Simulação de login - em produção, conectar ao backend real
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      createdAt: new Date()
    };

    const mockSubscription: Subscription = {
      id: Date.now().toString(),
      userId: mockUser.id,
      planTier: 'free',
      status: 'active',
      aiCreditsRemaining: 5
    };

    await AsyncStorage.setItem('@anuncialocal:user', JSON.stringify(mockUser));
    await AsyncStorage.setItem('@anuncialocal:subscription', JSON.stringify(mockSubscription));

    setUser(mockUser);
    setSubscription(mockSubscription);
  };

  const signUp = async (email: string, password: string) => {
    // Simulação de cadastro - em produção, conectar ao backend real
    await signIn(email, password);
  };

  const signOut = async () => {
    await AsyncStorage.multiRemove(['@anuncialocal:user', '@anuncialocal:subscription']);
    setUser(null);
    setSubscription(null);
  };

  const updateSubscription = (sub: Subscription) => {
    setSubscription(sub);
    AsyncStorage.setItem('@anuncialocal:subscription', JSON.stringify(sub));
  };

  const decrementCredits = async () => {
    if (!subscription) return;

    const updated = {
      ...subscription,
      aiCreditsRemaining: Math.max(0, subscription.aiCreditsRemaining - 1)
    };

    setSubscription(updated);
    await AsyncStorage.setItem('@anuncialocal:subscription', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        loading,
        signIn,
        signUp,
        signOut,
        updateSubscription,
        decrementCredits
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
