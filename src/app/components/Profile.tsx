import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Clipboard } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

export const Profile = () => {
  const user = {
    name: 'John Lennon',
    phone: '(+44) 20 1234 5689',
    gender: 'Male',
    birthday: '12/01/1997',
    email: 'john.lennon@mail.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  };

  const [isConnecting, setIsConnecting] = useState(false);

  const tryToConnectEmitter = () => {
    setIsConnecting(true);
    // Lancer la connexion BLE ici
    // ...
    setTimeout(() => setIsConnecting(false), 2000); // Simule la connexion
  };

  const handleCopy = (value: string) => {
    Clipboard.setString(value);
  };

  return (
    <View style={styles.container}>


      {/* Profile Picture */}
      <View style={styles.avatarContainer}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <TouchableOpacity style={styles.editAvatar}>
          <Ionicons name="pencil" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Name */}
      <Text style={styles.name}>{user.name}</Text>

      {/* User Info */}
      <View style={styles.infoContainer}>
        <ProfileInfo label="Phone" value={user.phone} onCopy={() => handleCopy(user.phone)} />
      </View>

      <TouchableOpacity style={styles.bleButton} onPress={tryToConnectEmitter} disabled={isConnecting}>
        <Ionicons name="bluetooth" size={20} color="#fff" />
        <Text style={styles.bleButtonText}>
          {isConnecting ? 'Connexion...' : 'Se connecter'}
        </Text>
      </TouchableOpacity>

      <View style={styles.pickerContainer}>
        <Ionicons name="radio-outline" size={20} color="#4DB6FF" style={{marginRight: 8}} />
      </View>

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
  avatarContainer: {
    marginTop: -60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  editAvatar: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#4DB6FF',
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: '#fff',
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
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF6FF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 18,
    width: '85%',
  },
  picker: {
    flex: 1,
    height: 40,
    color: '#222',
  },
});
