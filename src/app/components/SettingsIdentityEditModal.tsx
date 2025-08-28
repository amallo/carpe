import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

interface SettingsIdentityEditModalProps {
  visible: boolean;
  nickname: string;
  onNicknameChange: (nickname: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isButtonDisabled: boolean;
  charCount: number;
}

export const SettingsIdentityEditModal: React.FC<SettingsIdentityEditModalProps> = ({
  visible,
  nickname,
  onNicknameChange,
  onSave,
  onCancel,
  isButtonDisabled,
  charCount,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Modifier le profil</Text>
            <TouchableOpacity onPress={onCancel}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalSubtitle}>
            Modifiez votre nickname qui sera visible par les autres utilisateurs
          </Text>
          
          <TextInput
            style={styles.nicknameInput}
            placeholder="Votre nickname"
            value={nickname}
            onChangeText={onNicknameChange}
            maxLength={20}
            autoFocus
          />
          
          <Text style={styles.charCount}>
            {charCount}/20 caractères
          </Text>
          
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={onCancel}
            >
              <Text style={styles.modalCancelText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalConfirmButton, isButtonDisabled && styles.modalConfirmButtonDisabled]}
              onPress={onSave}
              disabled={isButtonDisabled}
            >
              <Text style={[styles.modalConfirmText, isButtonDisabled && styles.modalConfirmTextDisabled]}>
                Enregistrer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  nicknameInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  charCount: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
  },
  modalConfirmButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  modalConfirmTextDisabled: {
    color: '#9ca3af',
  },
});
