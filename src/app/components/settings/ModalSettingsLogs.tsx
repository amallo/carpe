import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useAppDispatch } from '../../store/hooks';
import { clearLogs } from '../../../core/logger/store/log.slice';
import { type LogEntryViewModel } from './settings-screen.viewmodel';

interface ModalSettingsLogsProps {
  visible: boolean;
  logs: LogEntryViewModel[];
  onClose: () => void;
}

export const ModalSettingsLogs: React.FC<ModalSettingsLogsProps> = ({
  visible,
  logs,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  const handleClearLogs = () => {
    Alert.alert(
      'Effacer les logs',
      'Êtes-vous sûr de vouloir effacer tous les logs système ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Effacer',
          style: 'destructive',
          onPress: () => {
            dispatch(clearLogs());
          },
        },
      ]
    );
  };

  const getLevelColor = (level: LogEntryViewModel['level']) => {
    switch (level) {
      case 'info': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { height: '70%' }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Logs système</Text>
            <View style={styles.modalHeaderActions}>
              <TouchableOpacity style={styles.clearLogsButton} onPress={handleClearLogs}>
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.logsContainer}>
            {logs.map((log) => (
              <View key={log.id} style={styles.logEntry}>
                <View style={styles.logHeader}>
                  <View style={[styles.logLevel, { backgroundColor: getLevelColor(log.level) }]} />
                  <Text style={styles.logTimestamp}>{log.timestamp}</Text>
                  <Text style={[styles.logLevelText, { color: getLevelColor(log.level) }]}>
                    {log.level.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.logMessage}>{log.message}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearLogsButton: {
    marginRight: 10,
  },
  logsContainer: {
    flex: 1,
  },
  logEntry: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  logLevel: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  logTimestamp: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'monospace',
    marginRight: 8,
  },
  logLevelText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  logMessage: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 16,
  },
});
