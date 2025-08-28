import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Clipboard } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { toast } from 'sonner-native';
import { useAppSelector } from '../store/hooks';
import { selectCurrentIdentity } from '../../core/identity/store/identity.slice';

export const Profile = () => {
  const navigation = useNavigation();
  const user = useAppSelector(selectCurrentIdentity);
  const [isConnecting, setIsConnecting] = useState(false);
  
  if (!user) {
    return null; // Ne devrait jamais arriver car on est dans l'app principale
  }

  const tryToConnectEmitter = () => {
    setIsConnecting(true);
    // Lancer la connexion BLE ici
    // ...
    setTimeout(() => setIsConnecting(false), 2000); // Simule la connexion
  };

  const handleCopy = (value: string) => {
    Clipboard.setString(value);
    toast.success('Copié dans le presse-papier');
  };

  const handleEditProfile = () => {
    navigation.navigate('Settings' as never);
  };

  const handleViewQRCode = () => {
    navigation.navigate('MyQRCode' as never);
  };

  return (
    <View style={styles.container}>


      {/* User Icon */}
      <View style={styles.userIconContainer}>
        <View style={styles.userIcon}>
          <Ionicons name="person" size={60} color="#4DB6FF" />
        </View>
      </View>

      {/* Name */}
      <Text style={styles.name}>{user.nickname}</Text>

      {/* User Info */}
      <View style={styles.infoContainer}>
        <ProfileInfo label="ID Utilisateur" value={user.id} onCopy={() => handleCopy(user.id)} />
      </View>

      {/* Action Buttons */}
      <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
        <Ionicons name="settings-outline" size={20} color="#fff" />
        <Text style={styles.actionButtonText}>Modifier le profil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={handleViewQRCode}>
        <Ionicons name="qr-code-outline" size={20} color="#fff" />
        <Text style={styles.actionButtonText}>Mon QR Code</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.bleButton} onPress={tryToConnectEmitter} disabled={isConnecting}>
        <Ionicons name="bluetooth" size={20} color="#fff" />
        <Text style={styles.bleButtonText}>
          {isConnecting ? 'Connexion...' : 'Se connecter'}
        </Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={20} color="#F36A6A" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const ProfileInfo = ({ label, value, onCopy }: { label: string; value: string; onCopy: () => void }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label} : <Text style={styles.infoValue}>{value}</Text></Text>
    <TouchableOpacity onPress={onCopy}>
      <Ionicons name="copy-outline" size={20} color="#888" />
    </TouchableOpacity>
  </View>
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6FBFF',
    alignItems: 'center',
    paddingTop: 40,
  },
  header: {
    width: '100%',
    backgroundColor: '#2256A3',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 8,
    fontStyle: 'italic',
  },
  userIconContainer: {
    marginTop: -60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EAF6FF',
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 20,
    color: '#222',
  },
  infoContainer: {
    width: '85%',
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    color: '#8A8FA3',
    fontSize: 16,
    fontWeight: '600',
  },
  infoValue: {
    color: '#222',
    fontWeight: '400',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4DB6FF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 18,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDECEC',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: '#F36A6A',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 8,
  },
  bleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4DB6FF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 18,
    marginTop: 10,
  },
  bleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4DB6FF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 12,
    width: '85%',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});
