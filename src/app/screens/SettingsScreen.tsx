import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { toast } from 'sonner-native';
import { useSettingsViewModel, type LogEntryViewModel } from '../components/settings/settings-screen.viewmodel';
import { useAppDispatch } from '../store/hooks';
import { clearLogs } from '../../core/logger/store/log.slice';
import { SettingsActivePeer } from '../components/settings/SettingsActivePeer';
import { SettingsIdentitySection } from '../components/settings/SettingsIdentitySection';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { logs } = useSettingsViewModel();
  const dispatch = useAppDispatch();

  const [settings, setSettings] = useState({
    allowConnections: true,
    autoReconnect: true,
    lowPowerMode: false,
    debugMode: false,
    encryptionEnabled: true,
  });

  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showPublicKeyModal, setShowPublicKeyModal] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

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
            toast.success('Logs effacés');
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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Paramètres</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Device Status Card */}
        <SettingsActivePeer />

        {/* User Profile Section */}
        <SettingsIdentitySection />

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionCard} onPress={() => setShowLogsModal(true)}>
              <Ionicons name="document-text" size={24} color="#4f46e5" />
              <Text style={styles.actionTitle}>Logs</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => setShowPublicKeyModal(true)}>
              <Ionicons name="key" size={24} color="#10b981" />
              <Text style={styles.actionTitle}>Clé publique</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => {}}>
              <Ionicons name="pulse" size={24} color="#f59e0b" />
              <Text style={styles.actionTitle}>Diagnostic</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Security Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sécurité</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Autoriser les connexions</Text>
                <Text style={styles.settingSubtitle}>Permet aux autres appareils de se connecter</Text>
              </View>
              <Switch
                value={settings.allowConnections}
                onValueChange={(value) => setSettings(prev => ({ ...prev, allowConnections: value }))}
                trackColor={{ false: '#d1d5db', true: '#4f46e5' }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Chiffrement activé</Text>
                <Text style={styles.settingSubtitle}>Communications chiffrées AES-256</Text>
              </View>
              <Switch
                value={settings.encryptionEnabled}
                onValueChange={(value) => setSettings(prev => ({ ...prev, encryptionEnabled: value }))}
                trackColor={{ false: '#d1d5db', true: '#10b981' }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </View>

        {/* Advanced Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paramètres avancés</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Reconnexion automatique</Text>
                <Text style={styles.settingSubtitle}>Se reconnecte automatiquement</Text>
              </View>
              <Switch
                value={settings.autoReconnect}
                onValueChange={(value) => setSettings(prev => ({ ...prev, autoReconnect: value }))}
                trackColor={{ false: '#d1d5db', true: '#4f46e5' }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Mode économie d'énergie</Text>
                <Text style={styles.settingSubtitle}>Réduit la consommation</Text>
              </View>
              <Switch
                value={settings.lowPowerMode}
                onValueChange={(value) => setSettings(prev => ({ ...prev, lowPowerMode: value }))}
                trackColor={{ false: '#d1d5db', true: '#f59e0b' }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Mode debug</Text>
                <Text style={styles.settingSubtitle}>Logs détaillés pour développeur</Text>
              </View>
              <Switch
                value={settings.debugMode}
                onValueChange={(value) => setSettings(prev => ({ ...prev, debugMode: value }))}
                trackColor={{ false: '#d1d5db', true: '#ef4444' }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>



      {/* Logs Modal */}
      <Modal visible={showLogsModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: '70%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Logs système</Text>
              <View style={styles.modalHeaderActions}>
                <TouchableOpacity style={styles.clearLogsButton} onPress={handleClearLogs}>
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowLogsModal(false)}>
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

      {/* Public Key Modal */}
      <Modal visible={showPublicKeyModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Clé publique</Text>
              <TouchableOpacity onPress={() => setShowPublicKeyModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.keyContainer}>
              <Text style={styles.keyLabel}>Clé publique de l'émetteur:</Text>
              <View style={styles.keyValue}>
                <Text style={styles.keyText}>{'activePairing.publicKey'}</Text>
                <TouchableOpacity
                  style={styles.copyKeyButton}
                  onPress={() => toast.success('Clé copiée dans le presse-papier')}
                >
                  <Ionicons name="copy" size={16} color="#4f46e5" />
                </TouchableOpacity>
              </View>
              <Text style={styles.keyNote}>
                Cette clé est utilisée pour chiffrer toutes les communications avec cet émetteur.
              </Text>
            </View>
          </View>
        </View>
      </Modal>



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

  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionTitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    fontWeight: '500',
  },
  settingsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  pinInput: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 8,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    marginRight: 8,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  modalConfirmButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    marginLeft: 8,
  },
  modalConfirmText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
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
  keyContainer: {
    alignItems: 'center',
  },
  keyLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  keyValue: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  keyText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#111827',
    flex: 1,
  },
  copyKeyButton: {
    padding: 4,
    marginLeft: 8,
  },
  keyNote: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  modalHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearLogsButton: {
    marginRight: 10,
  },
  // Profile styles
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  profileId: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  profileCreated: {
    fontSize: 12,
    color: '#9ca3af',
  },
  editProfileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 16,
  },
  profileAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  profileActionText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
  },
  nicknameInput: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: '#f9fafb',
  },
});
