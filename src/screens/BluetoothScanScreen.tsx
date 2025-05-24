import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';

import { useNavigation } from '@react-navigation/native';
import { toast } from 'sonner-native';

interface LoRaDevice {
  id: string;
  name: string;
  macAddress: string;
  signalStrength: number;
  batteryLevel?: number;
  firmware?: string;
  distance: string;
  lastSeen: string;
  isSecured: boolean;
  deviceType: 'lora_transceiver' | 'lora_gateway' | 'lora_node';
}

export default function BluetoothScanScreen() {
  const navigation = useNavigation();
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<LoRaDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<LoRaDevice | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [scanDuration, setScanDuration] = useState(0);

  // Simulated LoRa devices for demo
  const mockDevices: LoRaDevice[] = [
    {
      id: 'lora_001',
      name: 'LoRa Émetteur Pro v2.1',
      macAddress: 'AA:BB:CC:DD:EE:01',
      signalStrength: 85,
      batteryLevel: 78,
      firmware: '2.1.3',
      distance: '12m',
      lastSeen: 'Maintenant',
      isSecured: true,
      deviceType: 'lora_transceiver'
    },
    {
      id: 'lora_002',
      name: 'LoRa Gateway Mesh',
      macAddress: 'AA:BB:CC:DD:EE:02',
      signalStrength: 92,
      batteryLevel: 95,
      firmware: '1.8.2',
      distance: '8m',
      lastSeen: 'Il y a 5s',
      isSecured: true,
      deviceType: 'lora_gateway'
    },
    {
      id: 'lora_003',
      name: 'LoRa Node Basic',
      macAddress: 'AA:BB:CC:DD:EE:03',
      signalStrength: 67,
      distance: '25m',
      lastSeen: 'Il y a 12s',
      isSecured: false,
      deviceType: 'lora_node'
    },
    {
      id: 'lora_004',
      name: 'LoRa Emergency Unit',
      macAddress: 'AA:BB:CC:DD:EE:04',
      signalStrength: 43,
      batteryLevel: 23,
      firmware: '2.0.1',
      distance: '45m',
      lastSeen: 'Il y a 30s',
      isSecured: true,
      deviceType: 'lora_transceiver'
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isScanning) {
      interval = setInterval(() => {
        setScanDuration(prev => prev + 1);
        
        // Simulate device discovery over time
        if (scanDuration < 15) {
          const deviceIndex = Math.floor(scanDuration / 3);
          if (deviceIndex < mockDevices.length && !discoveredDevices.find(d => d.id === mockDevices[deviceIndex].id)) {
            setDiscoveredDevices(prev => [...prev, mockDevices[deviceIndex]]);
            toast.success(`Émetteur détecté: ${mockDevices[deviceIndex].name}`);
          }
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isScanning, scanDuration, discoveredDevices]);

  const handleBack = () => {
    navigation.goBack();
  };

  const startScan = () => {
    setIsScanning(true);
    setScanDuration(0);
    setDiscoveredDevices([]);
    toast.loading('Recherche d\'émetteurs LoRa...');
  };

  const stopScan = () => {
    setIsScanning(false);
    setScanDuration(0);
    toast.success(`Scan terminé - ${discoveredDevices.length} appareils trouvés`);
  };

  const handleDeviceConnect = (device: LoRaDevice) => {
    setSelectedDevice(device);
    if (device.isSecured) {
      setShowPinModal(true);
    } else {
      connectToDevice(device);
    }
  };

  const connectToDevice = (device: LoRaDevice) => {
    setIsConnecting(true);
    toast.loading(`Connexion à ${device.name}...`);

    setTimeout(() => {
      setIsConnecting(false);
      setShowPinModal(false);
      setPinCode('');
      
      toast.success('Connexion établie avec succès!', {
        description: `Connecté à ${device.name}`
      });
      
      // Navigate back to settings with connection established
      navigation.goBack();
    }, 3000);
  };

  const handlePinSubmit = () => {
    if (pinCode.length !== 4) {
      toast.error('Le code PIN doit contenir 4 chiffres');
      return;
    }

    if (selectedDevice) {
      connectToDevice(selectedDevice);
    }
  };

  const getDeviceIcon = (deviceType: LoRaDevice['deviceType']) => {
    switch (deviceType) {
      case 'lora_transceiver': return 'radio';
      case 'lora_gateway': return 'wifi';
      case 'lora_node': return 'hardware-chip';
      default: return 'bluetooth';
    }
  };

  const getSignalColor = (strength: number) => {
    if (strength >= 80) return '#10b981';
    if (strength >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getSignalBars = (strength: number) => {
    const bars = Math.ceil(strength / 25);
    return Math.min(4, Math.max(1, bars));
  };

  const renderDevice = ({ item }: { item: LoRaDevice }) => (
    <TouchableOpacity 
      style={styles.deviceCard}
      onPress={() => handleDeviceConnect(item)}
      disabled={isConnecting}
    >
      <View style={styles.deviceHeader}>
        <View style={styles.deviceIcon}>
          <Ionicons 
            name={getDeviceIcon(item.deviceType)} 
            size={24} 
            color="#4f46e5" 
          />
        </View>
        
        <View style={styles.deviceInfo}>
          <View style={styles.deviceNameRow}>
            <Text style={styles.deviceName}>{item.name}</Text>
            {item.isSecured && (
              <Ionicons name="lock-closed" size={14} color="#f59e0b" />
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
                      height: bar * 3 + 2
                    }
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
          <View style={styles.deviceTypeTag}>
            <Text style={styles.deviceTypeText}>
              {item.deviceType.replace('lora_', '').toUpperCase()}
            </Text>
          </View>
        </View>
        
        <View style={styles.connectButton}>
          <Ionicons name="add-circle" size={20} color="#4f46e5" />
          <Text style={styles.connectText}>Connecter</Text>
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
          onPress={isScanning ? stopScan : startScan}
          disabled={isConnecting}
        >
          {isScanning ? (
            <ActivityIndicator size="small" color="#4f46e5" />
          ) : (
            <Ionicons name="search" size={24} color="#4f46e5" />
          )}
        </TouchableOpacity>
      </View>

      {/* Scan Status */}
      <View style={styles.scanStatus}>
        {isScanning ? (
          <View style={styles.scanningIndicator}>
            <View style={styles.scanningPulse} />
            <Text style={styles.scanningText}>
              Recherche en cours... ({scanDuration}s)
            </Text>
            <Text style={styles.scanSubtext}>
              {discoveredDevices.length} appareil{discoveredDevices.length !== 1 ? 's' : ''} trouvé{discoveredDevices.length !== 1 ? 's' : ''}
            </Text>
          </View>
        ) : (
          <View style={styles.idleIndicator}>
            <Ionicons name="bluetooth" size={20} color="#6b7280" />
            <Text style={styles.idleText}>
              {discoveredDevices.length > 0 
                ? `${discoveredDevices.length} émetteur${discoveredDevices.length !== 1 ? 's' : ''} disponible${discoveredDevices.length !== 1 ? 's' : ''}`
                : 'Appuyez sur rechercher pour scanner'
              }
            </Text>
          </View>
        )}
      </View>

      {/* Devices List */}
      <View style={styles.devicesContainer}>
        {discoveredDevices.length === 0 && !isScanning ? (
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
            data={discoveredDevices}
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
  deviceTypeText: {
    fontSize: 10,
    color: '#4f46e5',
    fontWeight: '600',
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  connectText: {
    fontSize: 12,
    color: '#4f46e5',
    fontWeight: '500',
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
});