import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

const { width, height } = Dimensions.get('window');

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

interface MessagesMapViewProps {
  mapUsers: MapUser[];
  selectedUser: string | null;
  onUserPress: (userId: string) => void;
  getRangeColor: (range: 'local' | 'medium' | 'long') => string;
  formatDistance: (distance: number) => string;
}

export function MessagesMapView({
  mapUsers,
  selectedUser,
  onUserPress,
  getRangeColor,
  formatDistance,
}: MessagesMapViewProps) {
  const renderMapUser = (user: MapUser) => {
    const isSelected = selectedUser === user.id;
    const latestMessage = user.messages[0];

    return (
      <View key={user.id}>
        {/* User Point */}
        <TouchableOpacity
          style={[
            styles.mapUserPoint,
            {
              left: user.x - 20,
              top: user.y - 20,
              backgroundColor: user.isActive ? '#4f46e5' : '#94a3b8',
              transform: [{ scale: isSelected ? 1.2 : 1 }],
            },
          ]}
          onPress={() => onUserPress(user.id)}
        >
          <Text style={styles.mapUserAvatar}>{user.avatar}</Text>
          {user.isActive && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        {/* Message Bubble */}
        {isSelected && latestMessage && (
          <View style={[
            styles.messageBubble,
            {
              left: user.x - 100,
              top: user.y - 80,
            },
          ]}>
            <View style={styles.bubbleContent}>
              <Text style={styles.bubbleSender}>{user.name}</Text>
              <Text style={styles.bubbleMessage} numberOfLines={2}>
                {latestMessage.message}
              </Text>
              <View style={styles.bubbleFooter}>
                <Text style={styles.bubbleTime}>{latestMessage.timestamp}</Text>
                <Text style={styles.bubbleDistance}>
                  {formatDistance(latestMessage.distance)}
                </Text>
              </View>
            </View>
            <View style={styles.bubbleArrow} />
          </View>
        )}

        {/* Range Circle */}
        {isSelected && (
          <View style={[
            styles.rangeCircle,
            {
              left: user.x - 50,
              top: user.y - 50,
              borderColor: getRangeColor(latestMessage.range),
            },
          ]} />
        )}
      </View>
    );
  };

  return (
    <>
      {/* Map View */}
      <View style={styles.mapContainer}>
        <View style={styles.mapBackground}>
          {/* Background Grid */}
          <View style={styles.mapGrid} />

          {/* Center Point (You) */}
          <View style={styles.centerPoint}>
            <View style={styles.centerCircle}>
              <Ionicons name="radio" size={16} color="#4f46e5" />
            </View>
            <Text style={styles.centerLabel}>Vous</Text>
          </View>

          {/* Map Users */}
          {mapUsers.map(renderMapUser)}
        </View>
      </View>

      {/* Map Legend */}
      <View style={styles.mapLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
          <Text style={styles.legendText}>Local (500m)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
          <Text style={styles.legendText}>Moyen (2km)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
          <Text style={styles.legendText}>Long (10km)</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mapBackground: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#f8f9fa',
  },
  mapGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    backgroundColor: 'transparent',
    backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)',
    backgroundSize: '20px 20px',
  },
  centerPoint: {
    position: 'absolute',
    left: width * 0.5 - 30,
    top: height * 0.4 - 30,
    alignItems: 'center',
  },
  centerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    borderWidth: 3,
    borderColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  centerLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#4f46e5',
  },
  mapUserPoint: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  mapUserAvatar: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  activeIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  messageBubble: {
    position: 'absolute',
    width: 200,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  bubbleContent: {
    flex: 1,
  },
  bubbleSender: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  bubbleMessage: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 16,
    marginBottom: 8,
  },
  bubbleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bubbleTime: {
    fontSize: 10,
    color: '#6b7280',
  },
  bubbleDistance: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '500',
  },
  bubbleArrow: {
    position: 'absolute',
    bottom: -8,
    left: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#ffffff',
  },
  rangeCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderStyle: 'dashed',
    opacity: 0.5,
  },
  mapLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f8fafc',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
});
