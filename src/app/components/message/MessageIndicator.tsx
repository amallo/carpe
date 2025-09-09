import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { PublicMessageStatus } from './PublicMessageList.viewmodel';

interface MessageIndicatorProps {
  status: PublicMessageStatus;
}

export function MessageIndicator({ status }: MessageIndicatorProps) {
  const getStatusColor = (statusType: PublicMessageStatus): string => {
    switch (statusType) {
      case 'submitted': return '#f59e0b'; // Orange
      case 'broadcasted': return '#10b981'; // Green
      case 'unknown': return '#6b7280'; // Gray
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (statusType: PublicMessageStatus): string => {
    switch (statusType) {
      case 'submitted': return 'En attente';
      case 'broadcasted': return 'Diffusé';
      case 'unknown': return 'Inconnu';
      default: return 'Inconnu';
    }
  };

  const getStatusIcon = (statusType: PublicMessageStatus): string => {
    switch (statusType) {
      case 'submitted': return 'time';
      case 'broadcasted': return 'checkmark-circle';
      case 'unknown': return 'help-circle';
      default: return 'help-circle';
    }
  };

  const statusColor = getStatusColor(status);
  const statusLabel = getStatusLabel(status);
  const statusIcon = getStatusIcon(status);

  return (
    <View style={styles.messageIndicator}>
      <Ionicons name={statusIcon as any} size={16} color={statusColor} />
      <Text style={[styles.messageIndicatorText, { color: statusColor }]}>
        {statusLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  messageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageIndicatorText: {
    fontSize: 10,
    marginLeft: 4,
    fontWeight: '500',
  },
});
