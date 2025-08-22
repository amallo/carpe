import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { toast } from 'sonner-native';

interface Contact {
  id: string;
  name: string;
  lastSeen: string;
  unreadCount: number;
  status: 'online' | 'offline';
}

interface BroadcastMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  distance: string;
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const [isLoRaConnected, setIsLoRaConnected] = useState(false);
  const [contacts] = useState<Contact[]>([
    { id: '1', name: 'Alice Dupont', lastSeen: 'Il y a 2 min', unreadCount: 2, status: 'online' },
    { id: '2', name: 'Marc Lefèvre', lastSeen: 'Il y a 15 min', unreadCount: 0, status: 'offline' },
    { id: '3', name: 'Sophie Martin', lastSeen: 'Il y a 1h', unreadCount: 1, status: 'online' },
  ]);

  const [recentBroadcasts] = useState<BroadcastMessage[]>([
    { id: '1', sender: 'Jean Petit', message: 'Quelqu\'un près du parc municipal ?', timestamp: '14:32', distance: '250m' },
    { id: '2', sender: 'Marie Claire', message: 'Urgent: recherche médecin dans le secteur', timestamp: '14:15', distance: '180m' },
  ]);

  useEffect(() => {
    // Simulate LoRa connection status
    const timer = setTimeout(() => {
      setIsLoRaConnected(true);
      toast.success('Émetteur LoRa connecté', {
        description: 'Prêt à communiquer',
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);  const handleAddContact = () => {
    navigation.navigate('QRScanner' as never);
  };

  const handleContactPress = (contact: Contact) => {
    navigation.navigate('Chat' as never, { contact } as never);
  };
  const handlePublicMessage = () => {
    navigation.navigate('PublicMessages' as never);
  };
  const handleWritePublicMessage = () => {
    navigation.navigate('Broadcast' as never);
  };
  const handleSettings = () => {
    navigation.navigate('Settings' as never);
  };

  const handleBluetoothScan = () => {
    navigation.navigate('BluetoothScan' as never);
  };

  const handleViewAllContacts = () => {
    navigation.navigate('Contacts' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>LoRa Mesh</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: isLoRaConnected ? '#22c55e' : '#ef4444' }]} />
            <Text style={styles.statusText}>
              {isLoRaConnected ? 'Connecté' : 'Déconnecté'}
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} onPress={handleBluetoothScan}>
            <Ionicons name="bluetooth" size={24} color={isLoRaConnected ? '#10b981' : '#6b7280'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleAddContact}>
            <Ionicons name="qr-code-outline" size={24} color="#4f46e5" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleSettings}>
            <Ionicons name="settings-outline" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionCard} onPress={handlePublicMessage}>
              <View style={styles.actionIcon}>
                <Ionicons name="megaphone" size={24} color="#ffffff" />
              </View>
              <Text style={styles.actionTitle}>Diffuser</Text>
              <Text style={styles.actionSubtitle}>Message général</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleAddContact}>
              <View style={[styles.actionIcon, { backgroundColor: '#10b981' }]}>
                <Ionicons name="person-add" size={24} color="#ffffff" />
              </View>
              <Text style={styles.actionTitle}>Inviter</Text>
              <Text style={styles.actionSubtitle}>Nouveau contact</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Broadcasts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Messages publics récents</Text>
            <TouchableOpacity onPress={()=>handlePublicMessage()}>
              <Text style={styles.seeAllText}>Tout voir</Text>
            </TouchableOpacity>
          </View>

          {recentBroadcasts.length === 0 ? (
            <Text style={styles.broadcastMessage}>Aucune diffusion récente</Text>
          ) : (
            recentBroadcasts.map((broadcast) => (
              <View key={broadcast.id} style={styles.broadcastCard}>
                <View style={styles.broadcastHeader}>
                  <Text style={styles.broadcastSender}>{broadcast.sender}</Text>
                  <View style={styles.broadcastMeta}>
                    <Text style={styles.broadcastDistance}>{broadcast.distance}</Text>
                    <Text style={styles.broadcastTime}>{broadcast.timestamp}</Text>
                  </View>
                </View>
                <Text style={styles.broadcastMessage}>{broadcast.message}</Text>
              </View>
            ))
          )}
        </View>

        {/* Contacts */}
        <View style={styles.section}>          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Contacts ({contacts.length})</Text>
            <TouchableOpacity onPress={handleViewAllContacts}>
              <Text style={styles.seeAllText}>Tout voir</Text>
            </TouchableOpacity>
          </View>

          {contacts.length === 0 ? (
            <Text style={styles.contactLastSeen}>Aucun contact</Text>
          ) : (
            contacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={styles.contactCard}
                onPress={() => handleContactPress(contact)}
              >
                <View style={styles.contactAvatar}>
                  <Text style={styles.avatarText}>
                    {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </Text>
                </View>

                <View style={styles.contactInfo}>
                  <View style={styles.contactHeader}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <View style={[styles.statusIndicator, {
                      backgroundColor: contact.status === 'online' ? '#22c55e' : '#94a3b8',
                    }]} />
                  </View>
                  <Text style={styles.contactLastSeen}>{contact.lastSeen}</Text>
                </View>

                <View style={styles.contactMeta}>
                  {contact.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{contact.unreadCount}</Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleWritePublicMessage}>
        <Ionicons name="megaphone" size={24} color="#ffffff" />
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#6b7280',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4f46e5',
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  broadcastCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  broadcastHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  broadcastSender: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  broadcastMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  broadcastDistance: {
    fontSize: 12,
    color: '#059669',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  broadcastTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  broadcastMessage: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  contactInfo: {
    flex: 1,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  contactLastSeen: {
    fontSize: 14,
    color: '#6b7280',
  },
  contactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
