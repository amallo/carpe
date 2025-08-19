import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';

import { useNavigation } from '@react-navigation/native';
import { toast } from 'sonner-native';
import { PeerViewModel, useBluetoothScannerViewModel } from './BluetoothScanner.viewmodel';
import { Permission } from '../components/Permission';

export default function BluetoothScanScreen() {
  const navigation = useNavigation();
  const [selectedDevice, setSelectedDevice] = useState<PeerViewModel | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const viewmodel = useBluetoothScannerViewModel();

  // Gestion des erreurs via le viewmodel
  useEffect(() => {
    if (viewmodel.error) {
      toast.error('Impossible de se connecter à l\'émetteur', {
        description: viewmodel.error,
      });
    }
  }, [viewmodel.error]);

  const handleBack = () => {
    navigation.goBack();
  };

  const startScan = () => {
    viewmodel.startScan();
    toast.loading('Recherche d\'émetteurs LoRa...');
  };

  const handleDeviceConnect = (device: PeerViewModel) => {
    setSelectedDevice(device);
    if (device.isSecured) {
      setShowPinModal(true);
    } else {
      pairing(device);
    }
  };

  const pairing = async (device: PeerViewModel) => {
    setIsConnecting(true);
    toast.loading(`Connexion à ${device.name}...`);

    try {
      await viewmodel.pair(device.id);

      setIsConnecting(false);
      setShowPinModal(false);
      setPinCode('');

      toast.success('Connexion établie avec succès!', {
        description: `Connecté à ${device.name}`,
      });

    } catch (error) {
      setIsConnecting(false);
      // L'erreur est déjà gérée par le useEffect ci-dessus
    }
  };

  const handlePinSubmit = () => {
    if (pinCode.length !== 4) {
      toast.error('Le code PIN doit contenir 4 chiffres');
      return;
    }

    if (selectedDevice) {
      pairing(selectedDevice);
    }
  };

  const getDeviceIcon = (deviceType: PeerViewModel['deviceType']) => {
    switch (deviceType) {
      case 'lora_transceiver': return 'radio';
      case 'lora_gateway': return 'wifi';
      case 'lora_node': return 'hardware-chip';
      default: return 'bluetooth';
    }
  };

  const getSignalColor = (strength: number) => {
    if (strength >= 80) {return '#10b981';}
    if (strength >= 60) {return '#f59e0b';}
    return '#ef4444';
  };

  const getSignalBars = (strength: number) => {
    const bars = Math.ceil(strength / 25);
    return Math.min(4, Math.max(1, bars));
  };

  // Si les permissions sont refusées, afficher l'écran de permissions
  if (viewmodel.missingPermission.length > 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.title}>Émetteurs</Text>
          <View style={{ width: 40 }} />
        </View>
        <ScrollView style={styles.permissionsContainer} showsVerticalScrollIndicator={false}>
          {viewmodel.missingPermission.map((p) => (
            <Permission key={p.permissionId} permission={p} />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  const renderDevice = ({ item }: { item: PeerViewModel }) => (
    <TouchableOpacity
      style={[
        styles.deviceCard,
        item.isConnected && styles.deviceCardConnected
      ]}
      onPress={() => handleDeviceConnect(item)}
      disabled={isConnecting}
    >
      <View style={styles.deviceHeader}>
        <View style={[
          styles.deviceIcon,
          item.isConnected && styles.deviceIconConnected
        ]}>
          <Ionicons
            name={getDeviceIcon(item.deviceType)}
            size={24}
            color={item.isConnected ? "#ffffff" : "#4f46e5"}
          />
        </View>

        <View style={styles.deviceInfo}>
          <View style={styles.deviceNameRow}>
            <Text style={[
              styles.deviceName,
              item.isConnected && styles.deviceNameConnected
            ]}>
              {item.name}
            </Text>
            {item.isSecured && (
              <Ionicons name="lock-closed" size={14} color="#f59e0b" />
            )}
            {item.isConnected && (
              <View style={styles.connectedBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                <Text style={styles.connectedText}>Connecté</Text>
              </View>
            )}
          </View>
          <Text style={styles.deviceMac}>{item.macAddress}</Text>
          <View style={styles.deviceMeta}>
            <Text style={styles.deviceDistance}>📍 {item.distance}</Text>
            <Text style={styles.deviceLastSeen}>🕒 {item.lastSeen}</Text>
          </View>
        </View>

        <View style={styles.deviceStats}>
          {/* Signal Strength */}
          <View style={styles.signalContainer}>
            <View style={styles.signalBars}>
              {[1, 2, 3, 4].map(bar => (
                <View
                  key={bar}
                  style={[
                    styles.signalBar,
                    {
                      backgroundColor: bar <= getSignalBars(item.signalStrength)
                        ? getSignalColor(item.signalStrength)
                        : '#e5e7eb',
                      height: bar * 3 + 2,
                    },
                  ]}
                />
              ))}
            </View>
            <Text style={styles.signalText}>{item.signalStrength}%</Text>
          </View>

          {/* Battery Level */}
          {item.batteryLevel && (
            <View style={styles.batteryContainer}>
              <Ionicons
                name="battery-half"
                size={16}
                color={item.batteryLevel > 30 ? '#10b981' : '#ef4444'}
              />
              <Text style={styles.batteryText}>{item.batteryLevel}%</Text>
            </View>
          )}
        </View>
      </View>

      {/* Device Footer */}
      <View style={styles.deviceFooter}>
        <View style={styles.deviceDetails}>
          {item.firmware && (
            <Text style={styles.firmwareText}>FW: {item.firmware}</Text>
          )}
          <View style={[
            styles.deviceTypeTag,
            item.isConnected && styles.deviceTypeTagConnected
          ]}>
            <Text style={[
              styles.deviceTypeText,
              item.isConnected && styles.deviceTypeTextConnected
            ]}>
              {item.deviceType.replace('lora_', '').toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={[
          styles.connectButton,
          item.isConnected && styles.connectButtonConnected
        ]}>
          {item.isConnected ? (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.connectTextConnected}>Connecté</Text>
            </>
          ) : (
            <>
              <Ionicons name="add-circle" size={20} color="#4f46e5" />
              <Text style={styles.connectText}>Connecter</Text>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Émetteurs LoRa</Text>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={startScan}
          disabled={isConnecting}
        >
          {viewmodel.isScanning ? (
            <ActivityIndicator size="small" color="#4f46e5" />
          ) : (
            <Ionicons name="search" size={24} color="#4f46e5" />
          )}
        </TouchableOpacity>
      </View>

      {/* Scan Status */}
      <View style={styles.scanStatus}>
        {viewmodel.isScanning ? (
          <View style={styles.scanningIndicator}>
            <View style={styles.scanningPulse} />
            <Text style={styles.scanningText}>
              Recherche en cours...
            </Text>
            <Text style={styles.scanSubtext}>
              {viewmodel.peers.length} appareil{viewmodel.peers.length !== 1 ? 's' : ''} trouvé{viewmodel.peers.length !== 1 ? 's' : ''}
            </Text>
          </View>
        ) : (
          <View style={styles.idleIndicator}>
            <Ionicons name="bluetooth" size={20} color="#6b7280" />
            <Text style={styles.idleText}>
              {viewmodel.peers.length > 0
                ? `${viewmodel.peers.length} émetteur${viewmodel.peers.length !== 1 ? 's' : ''} disponible${viewmodel.peers.length !== 1 ? 's' : ''}`
                : 'Appuyez sur rechercher pour scanner'
              }
            </Text>
          </View>
        )}
      </View>

      {/* Devices List */}
      <View style={styles.devicesContainer}>
        {viewmodel.peers.length === 0 && !viewmodel.isScanning ? (
          <View style={styles.emptyState}>
            <Ionicons name="radio-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Aucun émetteur détecté</Text>
            <Text style={styles.emptySubtitle}>
              Assurez-vous que votre émetteur LoRa est allumé et en mode appairage
            </Text>
            <TouchableOpacity style={styles.startScanButton} onPress={startScan}>
              <Text style={styles.startScanText}>Commencer la recherche</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={viewmodel.peers}
            keyExtractor={(item) => item.id}
            renderItem={renderDevice}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.devicesList}
          />
        )}
      </View>

      {/* PIN Modal */}
      <Modal visible={showPinModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="shield-checkmark" size={24} color="#f59e0b" />
              <Text style={styles.modalTitle}>Appareil sécurisé</Text>
            </View>

            <Text style={styles.modalSubtitle}>
              {selectedDevice?.name} nécessite un code PIN pour se connecter
            </Text>

            <TextInput
              style={styles.pinInput}
              value={pinCode}
              onChangeText={setPinCode}
              placeholder="••••"
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
              autoFocus
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowPinModal(false);
                  setPinCode('');
                  setSelectedDevice(null);
                }}
                disabled={isConnecting}
              >
                <Text style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalConfirmButton, isConnecting && styles.modalButtonDisabled]}
                onPress={handlePinSubmit}
                disabled={isConnecting || pinCode.length !== 4}
              >
                {isConnecting ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.modalConfirmText}>Connecter</Text>
                )}
              </TouchableOpacity>
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
  scanButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanStatus: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  scanningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanningPulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4f46e5',
    marginRight: 12,
    opacity: 0.8,
  },
  scanningText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4f46e5',
    flex: 1,
  },
  scanSubtext: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 24,
  },
  idleIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  idleText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  devicesContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  startScanButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startScanText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  devicesList: {
    padding: 20,
  },
  deviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#4f46e5',
  },
  deviceCardConnected: {
    borderLeftColor: '#10b981',
    borderLeftWidth: 4,
    backgroundColor: '#f0fdf4',
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceIconConnected: {
    backgroundColor: '#10b981',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceNameRow: {
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
  deviceNameConnected: {
    color: '#10b981',
  },
  deviceMac: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#6b7280',
    marginBottom: 4,
  },
  deviceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceDistance: {
    fontSize: 12,
    color: '#10b981',
    marginRight: 12,
  },
  deviceLastSeen: {
    fontSize: 12,
    color: '#6b7280',
  },
  deviceStats: {
    alignItems: 'center',
  },
  signalContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 4,
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
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryText: {
    fontSize: 10,
    color: '#6b7280',
    marginLeft: 2,
  },
  deviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  deviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  firmwareText: {
    fontSize: 11,
    color: '#6b7280',
    fontFamily: 'monospace',
    marginRight: 12,
  },
  deviceTypeTag: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  deviceTypeTagConnected: {
    backgroundColor: '#d1fae5',
  },
  deviceTypeText: {
    fontSize: 10,
    color: '#4f46e5',
    fontWeight: '600',
  },
  deviceTypeTextConnected: {
    color: '#065f46',
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  connectButtonConnected: {
    backgroundColor: '#d1fae5',
  },
  connectText: {
    fontSize: 12,
    color: '#4f46e5',
    fontWeight: '500',
    marginLeft: 4,
  },
  connectTextConnected: {
    fontSize: 12,
    color: '#065f46',
    fontWeight: '500',
    marginLeft: 4,
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  connectedText: {
    fontSize: 10,
    color: '#065f46',
    fontWeight: '600',
    marginLeft: 4,
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
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
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
  modalButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  modalConfirmText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  permissionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  permissionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  permissionNote: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 16,
  },
  permissionButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
    marginTop: 16,
  },
});
