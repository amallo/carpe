import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';

import { useNavigation } from '@react-navigation/native';
import { toast } from 'sonner-native';
import { useUser } from '../providers/UserProvider';

const { width } = Dimensions.get('window');

export default function MyQRCodeScreen() {
  const navigation = useNavigation();
  const { user } = useUser();
  
  const [userInfo] = useState({
    nickname: user?.nickname || 'Utilisateur',
    id: user?.id || 'LoRa_User_ABC123',
    publicKey: 'pk_' + Math.random().toString(36).substring(2, 15),
  });

  const handleBack = () => {
    navigation.goBack();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Ajoutez-moi sur LoRa Mesh!\nNickname: ${userInfo.nickname}\nID: ${userInfo.id}\nClé: ${userInfo.publicKey}`,
        title: 'Mon contact LoRa Mesh',
      });
    } catch (error) {
      toast.error('Erreur lors du partage');
    }
  };

  const handleCopyId = () => {
    // En réalité, on utiliserait Clipboard.setString(userInfo.id)
    toast.success('ID copié dans le presse-papier');
  };

  const handleRegenerateQR = () => {
    toast.success('QR Code régénéré avec une nouvelle clé');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Mon QR Code</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color="#4f46e5" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* QR Code Display */}
        <View style={styles.qrContainer}>
          <View style={styles.qrCodeArea}>
            {/* Simulated QR Code */}
            <View style={styles.qrCode}>
              <View style={styles.qrPattern}>
                {Array.from({ length: 12 }, (_, i) => (
                  <View key={i} style={styles.qrRow}>
                    {Array.from({ length: 12 }, (_, j) => (
                      <View
                        key={j}
                        style={[
                          styles.qrPixel,
                          { backgroundColor: (i + j) % 3 === 0 ? '#111827' : '#ffffff' },
                        ]}
                      />
                    ))}
                  </View>
                ))}
              </View>
            </View>

            {/* LoRa Logo in center */}
            <View style={styles.qrCenter}>
              <View style={styles.logoContainer}>
                <Ionicons name="radio" size={24} color="#4f46e5" />
              </View>
            </View>
          </View>

          <Text style={styles.qrInstruction}>
            Faites scanner ce code pour vous ajouter comme contact
          </Text>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={styles.userIcon}>
            <Ionicons name="person" size={32} color="#4DB6FF" />
          </View>

          <Text style={styles.userName}>{userInfo.nickname}</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ID Utilisateur</Text>
              <TouchableOpacity style={styles.copyButton} onPress={handleCopyId}>
                <Text style={styles.infoValue}>{userInfo.id}</Text>
                <Ionicons name="copy-outline" size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Clé Publique</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {userInfo.publicKey}...
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleShare}>
            <Ionicons name="share" size={20} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Partager</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleRegenerateQR}>
            <Ionicons name="refresh" size={20} color="#4f46e5" />
            <Text style={styles.secondaryButtonText}>Régénérer</Text>
          </TouchableOpacity>
        </View>

        {/* Security Info */}
        <View style={styles.securityInfo}>
          <View style={styles.securityCard}>
            <Ionicons name="shield-checkmark" size={20} color="#10b981" />
            <View style={styles.securityContent}>
              <Text style={styles.securityTitle}>Communication sécurisée</Text>
              <Text style={styles.securityText}>
                Ce QR code contient votre clé publique chiffrée. Seuls vos contacts approuvés peuvent communiquer avec vous.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  qrCodeArea: {
    position: 'relative',
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  qrCode: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  qrPattern: {
    flex: 1,
  },
  qrRow: {
    flex: 1,
    flexDirection: 'row',
  },
  qrPixel: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#f3f4f6',
  },
  qrCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4f46e5',
  },
  qrInstruction: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  userIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EAF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#4DB6FF',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    fontFamily: 'monospace',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4f46e5',
    paddingVertical: 16,
    borderRadius: 12,
    marginRight: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4f46e5',
    marginLeft: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4f46e5',
    marginLeft: 8,
  },
  securityInfo: {
    marginBottom: 32,
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  securityContent: {
    flex: 1,
    marginLeft: 12,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 4,
  },
  securityText: {
    fontSize: 12,
    color: '#166534',
    lineHeight: 16,
  },
});
