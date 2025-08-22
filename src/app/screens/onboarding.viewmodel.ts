import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createIdentity } from '../../core/identity/usecases/create-identity.usecase';
import { selectIsIdentityLoading, selectIdentityError } from '../../core/identity/store/identity.slice';

export const useOnboardingViewModel = () => {
  const dispatch = useAppDispatch();
  const [nickname, setNickname] = useState('');
  
  // Sélecteurs Redux
  const isLoading = useAppSelector(selectIsIdentityLoading);
  const error = useAppSelector(selectIdentityError);

  const handleCreateProfile = async () => {
    try {
      // Validation
      if (nickname.trim().length < 2) {
        throw new Error('Le nickname doit contenir au moins 2 caractères');
      }

      if (nickname.trim().length > 20) {
        throw new Error('Le nickname ne peut pas dépasser 20 caractères');
      }

      // Dispatch de l'action Redux
      await dispatch(createIdentity({ nickname: nickname.trim() })).unwrap();
    } catch (error) {
      // L'erreur sera gérée par le composant via le sélecteur error
      throw error;
    }
  };

  const isButtonDisabled = isLoading || nickname.trim().length < 2;

  return {
    // State
    nickname,
    isLoading,
    error,
    
    // Actions
    setNickname,
    handleCreateProfile,
    
    // Computed
    isButtonDisabled,
    charCount: nickname.length,
  };
};
