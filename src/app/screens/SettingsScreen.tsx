import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { toast } from 'sonner-native';

interface LoRaDevice {
  id: string;
  name: string;
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
  batteryLevel: number;
  signalStrength: number;
  lastSeen: string;
  publicKey: string;
  firmware: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
}

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [loraDevice, setLoraDevice] = useState<LoRaDevice>({
    id: 'lora_device_001',
    name: 'LoRa Émetteur v2.1',
    status: 'connected',
    batteryLevel: 78,
    signalStrength: 85,
    lastSeen: 'Il y a 30 sec',
    publicKey: 'pk_a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2',
    firmware: '2.1.3',
  });

  const [settings, setSettings] = useState({
    allowConnections: true,
    autoReconnect: true,
    lowPowerMode: false,
    debugMode: false,
    encryptionEnabled: true,
  });

  const [showPinModal, setShowPinModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showPublicKeyModal, setShowPublicKeyModal] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [healthStatus, setHealthStatus] = useState<'checking' | 'healthy' | 'warning' | 'error'>('healthy');

  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', timestamp: '15:32:45', level: 'info', message: 'Connexion Bluetooth établie avec succès' },
    { id: '2', timestamp: '15:32:40', level: 'info', message: 'Authentification PIN réussie' },
    { id: '3', timestamp: '15:30:12', level: 'warning', message: 'Signal LoRa faible détecté (65%)' },
    { id: '4', timestamp: '15:28:33', level: 'info', message: 'Message diffusé avec succès (12 destinataires)' },
    { id: '5', timestamp: '15:25:17', level: 'error', message: 'Échec de transmission - retry automatique' },
    { id: '6', timestamp: '15:20:45', level: 'info', message: 'Health check: Tous systèmes opérationnels' },
  ]);

  useEffect(() => {
    // Simulate device status updates
    const interval = setInterval(() => {
      setLoraDevice(prev => ({
        ...prev,
        batteryLevel: Math.max(20, prev.batteryLevel + (Math.random() > 0.5 ? 1 : -1)),
        signalStrength: Math.max(30, Math.min(100, prev.signalStrength + (Math.random() > 0.5 ? 2 : -2))),
        lastSeen: 'Il y a ' + Math.floor(Math.random() * 60) + ' sec',
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };  const handleConnectDevice = () => {
    if (loraDevice.status === 'connected') {
      Alert.alert(
        'Déconnecter l\'émetteur',
        'Êtes-vous sûr de vouloir vous déconnecter de l\'émetteur LoRa ?',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Déconnecter',
            style: 'destructive',
            onPress: () => {
              setLoraDevice(prev => ({ ...prev, status: 'disconnected' }));
              toast.success('Émetteur déconnecté');
            },
          },
        ]
      );
    } else {
      // Navigate to Bluetooth scan screen instead of showing PIN modal
      navigation.navigate('BluetoothScan' as never);
    }
  };

  const handlePinSubmit = () => {
    if (pinCode.length !== 4) {
      toast.error('Le code PIN doit contenir 4 chiffres');
      return;
    }

    setShowPinModal(false);
    setPinCode('');
    setLoraDevice(prev => ({ ...prev, status: 'connecting' }));

    setTimeout(() => {
      setLoraDevice(prev => ({ ...prev, status: 'connected' }));
      toast.success('Connexion établie avec l\'émetteur LoRa');

      // Add connection log
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString('fr-FR'),
        level: 'info',
        message: 'Connexion Bluetooth sécurisée établie',
      };
      setLogs(prev => [newLog, ...prev]);
    }, 2000);
  };

  const handleHealthCheck = () => {
    setHealthStatus('checking');
    toast.loading('Vérification de l\'état de l\'émetteur...');

    setTimeout(() => {
      const isHealthy = Math.random() > 0.3;
      setHealthStatus(isHealthy ? 'healthy' : 'warning');

      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString('fr-FR'),
        level: isHealthy ? 'info' : 'warning',
        message: isHealthy
          ? 'Health check: Tous systèmes opérationnels'
          : 'Health check: Attention - Signal faible détecté',
      };
      setLogs(prev => [newLog, ...prev]);

      toast.success(isHealthy ? 'Émetteur en parfait état' : 'Attention: Signal faible détecté');
    }, 3000);
  };

  const getDeviceStatusColor = () => {
    switch (loraDevice.status) {
      case 'connected': return '#10b981';
      case 'connecting': return '#f59e0b';
      case 'disconnected': return '#6b7280';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDeviceStatusText = () => {
    switch (loraDevice.status) {
      case 'connected': return 'Connecté';
      case 'connecting': return 'Connexion...';
      case 'disconnected': return 'Déconnecté';
      case 'error': return 'Erreur';
      default: return 'Inconnu';
    }
  };

  const getHealthStatusColor = () => {
    switch (healthStatus) {
      case 'healthy': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      case 'checking': return '#6366f1';
      default: return '#6b7280';
    }
  };

  const getLevelColor = (level: LogEntry['level']) => {
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
        <Text style={styles.title}>Paramètres LoRa</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Device Status Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>État de l'émetteur</Text>
          <View style={styles.deviceCard}>
            <View style={styles.deviceHeader}>
              <View style={styles.deviceInfo}>
                <View style={styles.deviceTitleRow}>
                  <Text style={styles.deviceName}>{loraDevice.name}</Text>
                  <View style={[styles.statusDot, { backgroundColor: getDeviceStatusColor() }]} />
                </View>
                <Text style={styles.deviceStatus}>{getDeviceStatusText()}</Text>
                <Text style={styles.deviceLastSeen}>{loraDevice.lastSeen}</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.connectButton,
                  { backgroundColor: loraDevice.status === 'connected' ? '#ef4444' : '#10b981' },
                ]}
                onPress={handleConnectDevice}
                disabled={loraDevice.status === 'connecting'}
              >
                <Ionicons
                  name={loraDevice.status === 'connected' ? 'close' : 'bluetooth'}
                  size={20}
                  color="#ffffff"
                />
              </TouchableOpacity>
            </View>

            {loraDevice.status === 'connected' && (
              <>
                {/* Device Stats */}
                <View style={styles.deviceStats}>
                  <View style={styles.statItem}>
                    <Ionicons name="battery-half" size={20} color="#10b981" />
                    <Text style={styles.statValue}>{loraDevice.batteryLevel}%</Text>
                    <Text style={styles.statLabel}>Batterie</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="radio" size={20} color="#4f46e5" />
                    <Text style={styles.statValue}>{loraDevice.signalStrength}%</Text>
                    <Text style={styles.statLabel}>Signal</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="code-working" size={20} color="#f59e0b" />
                    <Text style={styles.statValue}>{loraDevice.firmware}</Text>
                    <Text style={styles.statLabel}>Firmware</Text>
                  </View>
                </View>

                {/* Health Check */}
                <TouchableOpacity style={styles.healthCheckButton} onPress={handleHealthCheck}>
                  <View style={styles.healthCheckContent}>
                    <View style={[styles.healthIndicator, { backgroundColor: getHealthStatusColor() }]} />
                    <Text style={styles.healthCheckText}>
                      {healthStatus === 'checking' ? 'Vérification...' : 'Effectuer un Health Check'}
                    </Text>
                  </View>
                  <Ionicons name="medical" size={20} color="#4f46e5" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

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

            <TouchableOpacity style={styles.actionCard} onPress={handleHealthCheck}>
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

      {/* PIN Modal */}
      <Modal visible={showPinModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Code PIN Sécurisé</Text>
            <Text style={styles.modalSubtitle}>
              Entrez le code PIN à 4 chiffres de votre émetteur LoRa
            </Text>

            <TextInput
              style={styles.pinInput}
              value={pinCode}
              onChangeText={setPinCode}
              placeholder="••••"
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => { setShowPinModal(false); setPinCode(''); }}
              >
                <Text style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmButton} onPress={handlePinSubmit}>
                <Text style={styles.modalConfirmText}>Connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logs Modal */}
      <Modal visible={showLogsModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: '70%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Logs système</Text>
              <TouchableOpacity onPress={() => setShowLogsModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
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
                <Text style={styles.keyText}>{loraDevice.publicKey}</Text>
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
  deviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  deviceStatus: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  deviceLastSeen: {
    fontSize: 12,
    color: '#94a3b8',
  },
  connectButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  healthCheckButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  healthCheckContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  healthCheckText: {
    fontSize: 14,
    color: '#4f46e5',
    fontWeight: '500',
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
});
