import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSettingsIdentityViewModel } from './settings-identity.viewmodel';
import { SettingsIdentityEditModal } from './SettingsIdentityEditModal';

export const SettingsIdentitySection: React.FC = () => {
  const {
    user,
    isEditing,
    editingNickname,
    setEditingNickname,
    handleEditProfile,
    handleSaveProfile,
    handleCancelEdit,
    handleCopyUserId,
    handleViewQRCode,
    isButtonDisabled,
    charCount,
  } = useSettingsIdentityViewModel();

  return (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mon profil</Text>
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.nickname}</Text>
              <Text style={styles.profileId}>{user?.id}</Text>
            </View>
            <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
              <Ionicons name="pencil" size={20} color="#4f46e5" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileActions}>
            <TouchableOpacity style={styles.profileAction} onPress={handleCopyUserId}>
              <Ionicons name="copy-outline" size={16} color="#6b7280" />
              <Text style={styles.profileActionText}>Copier l'ID</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileAction} onPress={handleViewQRCode}>
              <Ionicons name="qr-code-outline" size={16} color="#6b7280" />
              <Text style={styles.profileActionText}>Mon QR Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <SettingsIdentityEditModal
        visible={isEditing}
        nickname={editingNickname}
        onNicknameChange={setEditingNickname}
        onSave={handleSaveProfile}
        onCancel={handleCancelEdit}
        isButtonDisabled={isButtonDisabled}
        charCount={charCount}
      />
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  profileId: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  profileCreated: {
    fontSize: 12,
    color: '#9ca3af',
  },
  editProfileButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  profileActions: {
    flexDirection: 'row',
    gap: 16,
  },
  profileAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  profileActionText: {
    fontSize: 14,
    color: '#6b7280',
  },
});
