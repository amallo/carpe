import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
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
  publicKey: string;
}

export default function ContactsScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Alice Dupont', lastSeen: 'Il y a 2 min', unreadCount: 2, status: 'online', publicKey: 'abc123' },
    { id: '2', name: 'Marc Lefèvre', lastSeen: 'Il y a 15 min', unreadCount: 0, status: 'offline', publicKey: 'def456' },
    { id: '3', name: 'Sophie Martin', lastSeen: 'Il y a 1h', unreadCount: 1, status: 'online', publicKey: 'ghi789' },
    { id: '4', name: 'Pierre Durand', lastSeen: 'Il y a 3h', unreadCount: 0, status: 'offline', publicKey: 'jkl012' },
    { id: '5', name: 'Emma Bernard', lastSeen: 'Hier', unreadCount: 3, status: 'online', publicKey: 'mno345' },
  ]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddContact = () => {
    navigation.navigate('QRScanner' as never);
  };

  const handleContactPress = (contact: Contact) => {
    navigation.navigate('Chat' as never, { contact } as never);
  };

  const handleDeleteContact = (contactId: string, contactName: string) => {
    Alert.alert(
      'Supprimer le contact',
      `Êtes-vous sûr de vouloir supprimer ${contactName} de vos contacts ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setContacts(contacts.filter(c => c.id !== contactId));
            toast.success('Contact supprimé', {
              description: `${contactName} a été retiré de vos contacts`,
            });
          },
        },
      ]
    );
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <View style={styles.contactContainer}>
      <TouchableOpacity
        style={styles.contactCard}
        onPress={() => handleContactPress(item)}
      >
        <View style={styles.contactAvatar}>
          <Text style={styles.avatarText}>
            {item.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </Text>
        </View>

        <View style={styles.contactInfo}>
          <View style={styles.contactHeader}>
            <Text style={styles.contactName}>{item.name}</Text>
            <View style={[styles.statusIndicator, {
              backgroundColor: item.status === 'online' ? '#22c55e' : '#94a3b8',
            }]} />
          </View>
          <Text style={styles.contactLastSeen}>{item.lastSeen}</Text>
          <Text style={styles.contactId}>ID: {item.publicKey.substring(0, 8)}...</Text>
        </View>

        <View style={styles.contactActions}>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleContactPress(item)}
          >
            <Ionicons name="chatbubble" size={20} color="#4f46e5" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteContact(item.id, item.name)}
          >
            <Ionicons name="trash" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Contacts ({contacts.length})</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
          <Ionicons name="person-add" size={24} color="#4f46e5" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un contact..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionCard} onPress={handleAddContact}>
          <View style={styles.quickActionIcon}>
            <Ionicons name="qr-code" size={24} color="#4f46e5" />
          </View>
          <Text style={styles.quickActionText}>Scanner QR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => navigation.navigate('MyQRCode' as never)}
        >
          <View style={styles.quickActionIcon}>
            <Ionicons name="share" size={24} color="#10b981" />
          </View>
          <Text style={styles.quickActionText}>Mon QR Code</Text>
        </TouchableOpacity>
      </View>

      {/* Contacts List */}
      <View style={styles.listContainer}>
        {filteredContacts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'Aucun contact trouvé' : 'Aucun contact'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? 'Essayez un autre terme de recherche'
                : 'Commencez par scanner le QR code d\'un ami'
              }
            </Text>
            {!searchQuery && (
              <TouchableOpacity style={styles.emptyAction} onPress={handleAddContact}>
                <Text style={styles.emptyActionText}>Ajouter un contact</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredContacts}
            keyExtractor={(item) => item.id}
            renderItem={renderContact}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddContact}>
        <Ionicons name="add" size={24} color="#ffffff" />
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  quickActionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  quickActionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  contactContainer: {
    marginBottom: 12,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
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
    marginBottom: 2,
  },
  contactId: {
    fontSize: 12,
    color: '#94a3b8',
    fontFamily: 'monospace',
  },
  contactActions: {
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
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyAction: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyActionText: {
    fontSize: 16,
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
