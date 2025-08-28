import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { toast } from 'sonner-native';
import { useAppSelector } from '../store/hooks';
import { selectCurrentIdentity } from '../../core/identity/store/identity.slice';

export interface SettingsIdentityViewModel {
  // State
  user: any;
  isEditing: boolean;
  editingNickname: string;
  
  // Actions
  setEditingNickname: (nickname: string) => void;
  handleEditProfile: () => void;
  handleSaveProfile: () => Promise<void>;
  handleCancelEdit: () => void;
  handleCopyUserId: () => void;
  handleViewQRCode: () => void;
  
  // Computed
  isButtonDisabled: boolean;
  charCount: number;
}

export const useSettingsIdentityViewModel = () => {
  const navigation = useNavigation();
  const user = useAppSelector(selectCurrentIdentity);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNickname, setEditingNickname] = useState(user?.nickname || '');

  const handleEditProfile = () => {
    if (!user) {
      toast.error('Aucun profil trouvé');
      return;
    }
    
    setEditingNickname(user.nickname);
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      // TODO: Implémenter la mise à jour du nickname via Redux
      // await dispatch(updateIdentity({ nickname: editingNickname.trim() })).unwrap();
      toast.success('Profil mis à jour');
      setIsEditing(false);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil');
    }
  };

  const handleCancelEdit = () => {
    setEditingNickname(user?.nickname || '');
    setIsEditing(false);
  };

  const handleCopyUserId = () => {
    if (!user?.id) {
      toast.error('Aucun ID utilisateur disponible');
      return;
    }
    
    // TODO: Implémenter la copie dans le presse-papier
    // Clipboard.setString(user.id);
    toast.success('ID utilisateur copié dans le presse-papier');
  };

  const handleViewQRCode = () => {
    if (!user) {
      toast.error('Aucun profil trouvé');
      return;
    }
    
    navigation.navigate('MyQRCode' as never);
  };

  const isButtonDisabled = !editingNickname.trim() || editingNickname.trim().length < 2;
  const charCount = editingNickname.length;

  return {
    // State
    user,
    isEditing,
    editingNickname,
    
    // Actions
    setEditingNickname,
    handleEditProfile,
    handleSaveProfile,
    handleCancelEdit,
    handleCopyUserId,
    handleViewQRCode,
    
    // Computed
    isButtonDisabled,
    charCount,
  };
};
