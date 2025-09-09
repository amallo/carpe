import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, Dimensions, Animated, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';

import { useNavigation } from '@react-navigation/native';
import { toast } from 'sonner-native';
import { useAppSelector } from '../store/hooks';
import { selectCurrentIdentity } from '../../core/identity/store/identity.slice';
import { PublicMessagesStatusBar } from '../components/message/PublicMessagesStatusBar';
import { MessagesMapView } from '../components/message/MessagesMapView';
import { PublicMessagesHeader } from '../components/message/PublicMessagesHeader';
import { MessagesDistanceFilterBar } from '../components/message/MessagesDistanceFilterBar';
import { PublicMessageList } from '../components/message/PublicMessageList';
import { MessageInput } from '../components/message/MessageInput';
import { PublicMessageViewModel } from '../components/message/PublicMessageList.viewmodel';

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

export default function PublicMessagesScreen() {
  const navigation = useNavigation();
  const user = useAppSelector(selectCurrentIdentity);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [filterDistance, setFilterDistance] = useState<'all' | 'local' | 'medium' | 'long'>('all');
  const animatedValue = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<PublicMessageViewModel>>(null);

  const [publicMessages, setPublicMessages] = useState<PublicMessage[]>([
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
  ]);

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



  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <PublicMessagesHeader
        viewMode={viewMode}
        onBack={handleBack}
        onToggleViewMode={toggleViewMode}
      />

      {/* Filter Bar */}
      <MessagesDistanceFilterBar
        filterDistance={filterDistance}
        onFilterChange={setFilterDistance}
        getRangeColor={getRangeColor}
        getRangeLabel={getRangeLabel}
      />

      {/* Content */}
      <View style={styles.content}>
        {viewMode === 'list' ? (
          <>
            {/* Stats Bar */}
            <PublicMessagesStatusBar
              filteredMessages={filteredMessages}
              mapUsers={mapUsers}
              formatDistance={formatDistance}
            />

            {/* Messages List */}
            <PublicMessageList
              flatListRef={flatListRef}
              getSignalBars={getSignalBars}
              getRangeColor={getRangeColor}
              getRangeLabel={getRangeLabel}
              formatDistance={formatDistance}
            />
          </>
        ) : (
          <MessagesMapView
            mapUsers={mapUsers}
            selectedUser={selectedUser}
            onUserPress={handleUserPress}
            getRangeColor={getRangeColor}
            formatDistance={formatDistance}
          />
        )}
      </View>

      {/* Input - Only show in list mode */}
      {viewMode === 'list' && (
        <MessageInput
          onMessageSent={() => {
            // Scroll to bottom to show new message
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
          }}
        />
      )}

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
