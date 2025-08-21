import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner-native';

export interface User {
  id: string;
  nickname: string;
  createdAt: string;
  lastSeen: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  createUser: (nickname: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérification de l'existence de l'utilisateur au démarrage
  useEffect(() => {
    checkExistingUser();
  }, []);

  const checkExistingUser = async () => {
    try {
      // Simulation de vérification dans le stockage local
      // En réalité, on utiliserait AsyncStorage ou un autre système de persistance
      setTimeout(() => {
        // Pour la démo, on simule qu'aucun utilisateur n'existe
        // En production, on vérifierait réellement le stockage local
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'utilisateur:', error);
      setIsLoading(false);
    }
  };

  const createUser = async (nickname: string): Promise<void> => {
    try {
      // Validation
      if (nickname.trim().length < 2) {
        throw new Error('Le nickname doit contenir au moins 2 caractères');
      }

      if (nickname.trim().length > 20) {
        throw new Error('Le nickname ne peut pas dépasser 20 caractères');
      }

      // Simulation de création
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser: User = {
        id: 'LoRa_User_ABC123', // En réalité, ce serait généré de manière unique
        nickname: nickname.trim(),
        createdAt: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
      };

      // Ici on sauvegarderait dans le stockage local
      // await AsyncStorage.setItem('user', JSON.stringify(newUser));

      setUser(newUser);
      toast.success('Profil créé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la création du profil');
      throw error;
    }
  };

  const updateUser = async (updates: Partial<User>): Promise<void> => {
    try {
      if (!user) {
        throw new Error('Aucun utilisateur connecté');
      }

      // Simulation de mise à jour
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedUser: User = {
        ...user,
        ...updates,
        lastSeen: new Date().toISOString(),
      };

      // Ici on sauvegarderait dans le stockage local
      // await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

      setUser(updatedUser);
      toast.success('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour du profil');
      throw error;
    }
  };

  const logout = (): void => {
    try {
      // Ici on supprimerait du stockage local
      // await AsyncStorage.removeItem('user');

      setUser(null);
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const value: UserContextType = {
    user,
    isLoading,
    createUser,
    updateUser,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personnalisé pour utiliser le context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser doit être utilisé à l\'intérieur d\'un UserProvider');
  }
  return context;
};
