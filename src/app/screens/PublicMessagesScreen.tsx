import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';

import { useNavigation } from '@react-navigation/native';
import { toast } from 'sonner-native';

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

export default function PublicMessagesScreen() {
  const navigation = useNavigation();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [filterDistance, setFilterDistance] = useState<'all' | 'local' | 'medium' | 'long'>('all');
  const animatedValue = useRef(new Animated.Value(0)).current;

  const publicMessages: PublicMessage[] = [
    {
      id: '1',
      sender: 'Alice Dupont',
      senderAvatar: 'AD',
      message: 'Quelqu\'un près du parc municipal pour un café ?',
      timestamp: '14:32',
      distance: 180,
      signalStrength: 92,
      location: { latitude: 48.8566, longitude: 2.3522, name: 'Parc Municipal' },
      range: 'local',
    },
    {
      id: '2',
      sender: 'Marc Lefèvre',
      senderAvatar: 'ML',
      message: 'Attention: route bloquée avenue des Champs, prenez la déviation',
      timestamp: '14:15',
      distance: 650,
      signalStrength: 78,
      location: { latitude: 48.8588, longitude: 2.3532, name: 'Avenue des Champs' },
      range: 'medium',
    },
    {
      id: '3',
      sender: 'Sophie Martin',
      senderAvatar: 'SM',
      message: 'Concert gratuit ce soir à 20h dans le centre ville !',
      timestamp: '13:45',
      distance: 1200,
      signalStrength: 65,
      location: { latitude: 48.8606, longitude: 2.3376, name: 'Centre Ville' },
      range: 'medium',
    },
    {
      id: '4',
      sender: 'Pierre Durand',
      senderAvatar: 'PD',
      message: 'Urgent: Recherche médecin dans le secteur nord',
      timestamp: '13:20',
      distance: 2800,
      signalStrength: 45,
      location: { latitude: 48.8656, longitude: 2.3412, name: 'Secteur Nord' },
      range: 'long',
    },
    {
      id: '5',
      sender: 'Emma Bernard',
      senderAvatar: 'EB',
      message: 'Vide-grenier demain matin, plein de bonnes affaires !',
      timestamp: '12:58',
      distance: 420,
      signalStrength: 88,
      location: { latitude: 48.8546, longitude: 2.3502, name: 'Place du Marché' },
      range: 'local',
    },
    {
      id: '6',
      sender: 'Jean Petit',
      senderAvatar: 'JP',
      message: 'Test de portée longue distance - quelqu\'un me reçoit ?',
      timestamp: '12:30',
      distance: 4500,
      signalStrength: 32,
      location: { latitude: 48.8456, longitude: 2.3702, name: 'Zone Industrielle' },
      range: 'long',
    },
  ];

  // Generate map users from messages
  const mapUsers: MapUser[] = React.useMemo(() => {
    const users = new Map<string, MapUser>();

    publicMessages.forEach((message, index) => {
      if (!users.has(message.sender)) {
        users.set(message.sender, {
          id: message.sender,
          name: message.sender,
          avatar: message.senderAvatar,
          x: (width * 0.2) + (Math.sin(index * 0.8) * width * 0.3) + (width * 0.25),
          y: (height * 0.2) + (Math.cos(index * 0.6) * height * 0.2) + (height * 0.15),
          messages: [],
          isActive: Math.random() > 0.3,
        });
      }
      users.get(message.sender)!.messages.push(message);
    });

    return Array.from(users.values());
  }, [publicMessages]);

  const filteredMessages = publicMessages.filter(message => {
    if (filterDistance === 'all') {return true;}
    return message.range === filterDistance;
  });

  const handleBack = () => {
    navigation.goBack();
  };

  const toggleViewMode = () => {
    const newMode = viewMode === 'list' ? 'map' : 'list';
    setViewMode(newMode);

    Animated.timing(animatedValue, {
      toValue: newMode === 'map' ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    toast.success(`Mode ${newMode === 'map' ? 'carte' : 'liste'} activé`);
  };

  const getRangeColor = (range: PublicMessage['range']) => {
    switch (range) {
      case 'local': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'long': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getRangeLabel = (range: PublicMessage['range']) => {
    switch (range) {
      case 'local': return 'Local';
      case 'medium': return 'Moyen';
      case 'long': return 'Long';
      default: return '';
    }
  };

  const getSignalBars = (strength: number) => {
    return Math.ceil(strength / 25);
  };

  const formatDistance = (distance: number) => {
    if (distance < 1000) {return `${distance}m`;}
    return `${(distance / 1000).toFixed(1)}km`;
  };

  const handleUserPress = (userId: string) => {
    setSelectedUser(selectedUser === userId ? null : userId);
  };

  const renderMessageItem = ({ item }: { item: PublicMessage }) => (
    <View style={styles.messageCard}>
      <View style={styles.messageHeader}>
        <View style={styles.senderInfo}>
          <View style={styles.senderAvatar}>
            <Text style={styles.avatarText}>{item.senderAvatar}</Text>
          </View>
          <View style={styles.senderDetails}>
            <Text style={styles.senderName}>{item.sender}</Text>
            <Text style={styles.locationText}>📍 {item.location.name}</Text>
          </View>
        </View>

        <View style={styles.messageMetadata}>
          <Text style={styles.messageTime}>{item.timestamp}</Text>
          <View style={styles.signalContainer}>
            <View style={styles.signalBars}>
              {[1, 2, 3, 4].map(bar => (
                <View
                  key={bar}
                  style={[
                    styles.signalBar,
                    {
                      backgroundColor: bar <= getSignalBars(item.signalStrength)
                        ? getRangeColor(item.range)
                        : '#e5e7eb',
                      height: bar * 2 + 2,
                    },
                  ]}
                />
              ))}
            </View>
            <Text style={styles.signalText}>{item.signalStrength}%</Text>
          </View>
        </View>
      </View>

      <Text style={styles.messageText}>{item.message}</Text>

      <View style={styles.messageFooter}>
        <View style={[styles.rangeTag, { backgroundColor: getRangeColor(item.range) }]}>
          <Text style={styles.rangeTagText}>{getRangeLabel(item.range)}</Text>
        </View>
        <Text style={styles.distanceText}>{formatDistance(item.distance)}</Text>
      </View>
    </View>
  );

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
          onPress={() => handleUserPress(user.id)}
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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
 
        <Text style={styles.title}>Messages publics</Text>

        <TouchableOpacity style={styles.viewToggle} onPress={toggleViewMode}>
          <Ionicons
            name={viewMode === 'list' ? 'map' : 'list'}
            size={24}
            color="#4f46e5"
          />
        </TouchableOpacity>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(['all', 'local', 'medium', 'long'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                filterDistance === filter && styles.filterChipActive,
                filter !== 'all' && {
                  borderColor: getRangeColor(filter),
                  backgroundColor: filterDistance === filter ? getRangeColor(filter) : 'transparent',
                },
              ]}
              onPress={() => setFilterDistance(filter)}
            >
              <Text style={[
                styles.filterChipText,
                filterDistance === filter && styles.filterChipTextActive,
                filter !== 'all' && filterDistance === filter && { color: '#ffffff' },
              ]}>
                {filter === 'all' ? 'Tous' : getRangeLabel(filter)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {viewMode === 'list' ? (
          <>
            {/* Stats Bar */}
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

            {/* Messages List */}
            <FlatList
              data={filteredMessages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessageItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.messagesList}
            />
          </>
        ) : (
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
        )}
      </View>

      {selectedUser && viewMode === 'map' && (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setSelectedUser(null)}
        >
          <Ionicons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
      )}
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
  viewToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBar: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: '#4f46e5',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  messagesList: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  messageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  senderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  senderDetails: {
    flex: 1,
  },
  senderName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#6b7280',
  },
  messageMetadata: {
    alignItems: 'flex-end',
  },
  messageTime: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  signalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 4,
  },
  signalBar: {
    width: 3,
    marginHorizontal: 1,
    borderRadius: 1,
  },
  signalText: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '500',
  },
  messageText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rangeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  rangeTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  distanceText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
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
    backgroundColor: 'repeating-linear-gradient(0deg, #4f46e5, #4f46e5 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #4f46e5, #4f46e5 1px, transparent 1px, transparent 20px)',
  },
  centerPoint: {
    position: 'absolute',
    left: width / 2 - 30,
    top: height / 2 - 100,
    alignItems: 'center',
  },
  centerCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 3,
    borderColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  centerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4f46e5',
    marginTop: 4,
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
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  mapUserAvatar: {
    fontSize: 12,
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
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  messageBubble: {
    position: 'absolute',
    width: 200,
    zIndex: 10,
  },
  bubbleContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  bubbleSender: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4f46e5',
    marginBottom: 4,
  },
  bubbleMessage: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 16,
    marginBottom: 6,
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
    color: '#10b981',
    fontWeight: '500',
  },
  bubbleArrow: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -8,
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
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6b7280',
  },
  closeButton: {
    position: 'absolute',
    top: 80,
    right: 30,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
});
