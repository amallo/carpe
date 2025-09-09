import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PublicMessage {
  id: string;
  sender: string;
  senderAvatar: string;
  message: string;
  timestamp: string;
  distance: number;
  signalStrength: number;
  location: {
    latitude: number;
    longitude: number;
    name: string;
  };
  range: 'local' | 'medium' | 'long';
  isMe?: boolean;
}

interface MapUser {
  id: string;
  name: string;
  avatar: string;
  x: number;
  y: number;
  messages: PublicMessage[];
  isActive: boolean;
}

interface PublicMessagesStatusBarProps {
  filteredMessages: PublicMessage[];
  mapUsers: MapUser[];
  formatDistance: (distance: number) => string;
}

export function PublicMessagesStatusBar({
  filteredMessages,
  mapUsers,
  formatDistance,
}: PublicMessagesStatusBarProps) {
  return (
    <View style={styles.statsBar}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{filteredMessages.length}</Text>
        <Text style={styles.statLabel}>Messages</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{mapUsers.filter(u => u.isActive).length}</Text>
        <Text style={styles.statLabel}>Actifs</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>
          {filteredMessages.length > 0
            ? formatDistance(Math.max(...filteredMessages.map(m => m.distance)))
            : '0m'
          }
        </Text>
        <Text style={styles.statLabel}>Portée max</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8fafc',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
});
