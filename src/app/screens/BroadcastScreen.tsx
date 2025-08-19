import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';

import { useNavigation } from '@react-navigation/native';
import { toast } from 'sonner-native';

interface BroadcastMessage {
  id: string;
  message: string;
  timestamp: string;
  range: string;
  recipients: number;
  status: 'sending' | 'sent' | 'failed';
}

export default function BroadcastScreen() {
  const navigation = useNavigation();
  const [message, setMessage] = useState('');
  const [broadcastRange, setBroadcastRange] = useState<'local' | 'medium' | 'long'>('medium');
  const [recentBroadcasts, setRecentBroadcasts] = useState<BroadcastMessage[]>([
    {
      id: '1',
      message: 'Test de diffusion générale',
      timestamp: '14:30',
      range: 'Moyenne (2km)',
      recipients: 12,
      status: 'sent',
    },
    {
      id: '2',
      message: 'Quelqu\'un près du parc municipal ?',
      timestamp: '13:45',
      range: 'Locale (500m)',
      recipients: 5,
      status: 'sent',
    },
  ]);

  const handleBack = () => {
    navigation.goBack();
  };

  const getRangeSettings = (range: typeof broadcastRange) => {
    switch (range) {
      case 'local':
        return { distance: '500m', power: 'Faible', recipients: '3-8', color: '#10b981' };
      case 'medium':
        return { distance: '2km', power: 'Moyenne', recipients: '8-20', color: '#f59e0b' };
      case 'long':
        return { distance: '10km', power: 'Forte', recipients: '15-50', color: '#ef4444' };
    }
  };

  const currentRange = getRangeSettings(broadcastRange);

  const handleSendBroadcast = () => {
    if (message.trim().length === 0) {
      toast.error('Veuillez saisir un message');
      return;
    }

    if (message.length > 200) {
      toast.error('Message trop long (max 200 caractères)');
      return;
    }

    const newBroadcast: BroadcastMessage = {
      id: Date.now().toString(),
      message: message.trim(),
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      range: `${currentRange.power} (${currentRange.distance})`,
      recipients: Math.floor(Math.random() * 10) + 5,
      status: 'sending',
    };

    setRecentBroadcasts(prev => [newBroadcast, ...prev]);
    setMessage('');

    // Simulate sending process
    setTimeout(() => {
      setRecentBroadcasts(prev => prev.map(broadcast =>
        broadcast.id === newBroadcast.id ? { ...broadcast, status: 'sent' } : broadcast
      ));
      toast.success(`Message diffusé à ${newBroadcast.recipients} destinataires`, {
        description: `Portée: ${currentRange.distance}`,
      });
    }, 2000);
  };

  const getStatusIcon = (status: BroadcastMessage['status']) => {
    switch (status) {
      case 'sending':
        return <Ionicons name="time-outline" size={16} color="#f59e0b" />;
      case 'sent':
        return <Ionicons name="checkmark-circle" size={16} color="#10b981" />;
      case 'failed':
        return <Ionicons name="close-circle" size={16} color="#ef4444" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Diffusion générale</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Range Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portée de diffusion</Text>
          <View style={styles.rangeSelector}>
            {(['local', 'medium', 'long'] as const).map((range) => {
              const settings = getRangeSettings(range);
              const isSelected = broadcastRange === range;

              return (
                <TouchableOpacity
                  key={range}
                  style={[
                    styles.rangeOption,
                    isSelected && { borderColor: settings.color, backgroundColor: `${settings.color}15` },
                  ]}
                  onPress={() => setBroadcastRange(range)}
                >
                  <View style={[styles.rangeIndicator, { backgroundColor: settings.color }]} />
                  <View style={styles.rangeInfo}>
                    <Text style={[styles.rangeTitle, isSelected && { color: settings.color }]}>
                      {settings.power}
                    </Text>
                    <Text style={styles.rangeSubtitle}>{settings.distance}</Text>
                    <Text style={styles.rangeRecipients}>{settings.recipients} destinataires</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Message Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Votre message</Text>
          <View style={styles.messageContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Tapez votre message public..."
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={200}
              placeholderTextColor="#9ca3af"
            />
            <View style={styles.messageFooter}>
              <Text style={styles.characterCount}>
                {message.length}/200 caractères
              </Text>
              <View style={styles.encryptionIndicator}>
                <Ionicons name="shield-checkmark" size={14} color="#10b981" />
                <Text style={styles.encryptionText}>Chiffré</Text>
              </View>
            </View>
          </View>

          {/* Send Button */}
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: currentRange.color },
              message.trim().length === 0 && styles.sendButtonDisabled,
            ]}
            onPress={handleSendBroadcast}
            disabled={message.trim().length === 0}
          >
            <Ionicons name="megaphone" size={20} color="#ffffff" />
            <Text style={styles.sendButtonText}>
              Diffuser à {currentRange.distance}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Current Range Info */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons name="radio" size={20} color={currentRange.color} />
              <Text style={[styles.infoTitle, { color: currentRange.color }]}>
                Diffusion {currentRange.power}
              </Text>
            </View>
            <View style={styles.infoStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{currentRange.distance}</Text>
                <Text style={styles.statLabel}>Portée</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{currentRange.recipients}</Text>
                <Text style={styles.statLabel}>Destinataires</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>AES-256</Text>
                <Text style={styles.statLabel}>Chiffrement</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Broadcasts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Messages récents</Text>
          {recentBroadcasts.map((broadcast) => (
            <View key={broadcast.id} style={styles.broadcastCard}>
              <View style={styles.broadcastHeader}>
                <View style={styles.broadcastStatus}>
                  {getStatusIcon(broadcast.status)}
                  <Text style={[
                    styles.broadcastStatusText,
                    { color: broadcast.status === 'sent' ? '#10b981' : '#f59e0b' },
                  ]}>
                    {broadcast.status === 'sending' ? 'Envoi...' : 'Envoyé'}
                  </Text>
                </View>
                <Text style={styles.broadcastTime}>{broadcast.timestamp}</Text>
              </View>

              <Text style={styles.broadcastMessage}>{broadcast.message}</Text>

              <View style={styles.broadcastFooter}>
                <Text style={styles.broadcastRange}>{broadcast.range}</Text>
                <Text style={styles.broadcastRecipients}>
                  {broadcast.recipients} destinataires
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  rangeSelector: {
    gap: 12,
  },
  rangeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  rangeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  rangeInfo: {
    flex: 1,
  },
  rangeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  rangeSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  rangeRecipients: {
    fontSize: 12,
    color: '#94a3b8',
  },
  messageContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  messageInput: {
    padding: 16,
    fontSize: 16,
    color: '#111827',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  characterCount: {
    fontSize: 12,
    color: '#94a3b8',
  },
  encryptionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  encryptionText: {
    fontSize: 12,
    color: '#10b981',
    marginLeft: 4,
    fontWeight: '500',
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
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
  broadcastStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  broadcastStatusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  broadcastTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  broadcastMessage: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },
  broadcastFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  broadcastRange: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  broadcastRecipients: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
});
