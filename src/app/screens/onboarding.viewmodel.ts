import { useState } from 'react';
import { createIdentity } from '../../core/identity/usecases/create-identity.usecase';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectIdentityError, selectIsIdentityLoading, selectHasIdentity } from '../../core/identity/store/identity.slice';

export const useOnboardingViewModel = () => {
  const dispatch = useAppDispatch();
  const [nickname, setNickname] = useState('');

  // Sélecteurs Redux
  const isLoading = useAppSelector(selectIsIdentityLoading);
  const error = useAppSelector(selectIdentityError);
  const hasIdentity = useAppSelector(selectHasIdentity);

  const createFirstIdentity = async () => {
      // Validation
    if (nickname.trim().length < 2) {
      throw new Error('Le nickname doit contenir au moins 2 caractères');
    }

    if (nickname.trim().length > 20) {
      throw new Error('Le nickname ne peut pas dépasser 20 caractères');
    }

    // Dispatch de l'action Redux
    await dispatch(createIdentity({ nickname: nickname.trim() })).unwrap();
  };

  const isButtonDisabled = isLoading || nickname.trim().length < 2;

  return {
    // State
    nickname,
    isLoading,
    error,
    hasIdentity,

    // Actions
    setNickname,
    createFirstIdentity,

    // Computed
    isButtonDisabled,
    charCount: nickname.length,
  };
};
