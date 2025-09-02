import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

interface ActivePairing {
  name: string;
  statusColor: string;
  statusText: string;
  lastSeen: string;
  closePairingStatusButtonColor: string;
  statusIcon: 'battery-half' | 'radio' | 'code-working' | 'medical' | 'close' | 'checkmark';
  isConnected: boolean;
  batteryLevel: number;
  signalStrength: number;
  firmware: string;
}

interface SettingsScreenActivePeerProps {
  activePairing: ActivePairing;
  healthStatus: string;
  onConnectDevice: () => void;
  onHealthCheck: () => void;
}

export const SettingsScreenActivePeer: React.FC<SettingsScreenActivePeerProps> = ({
  activePairing,
  healthStatus,
  onConnectDevice,
  onHealthCheck,
}) => {
  const getHealthStatusColor = () => {
    switch (healthStatus) {
      case 'healthy':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'error':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>État de l'émetteur</Text>
      <View style={styles.deviceCard}>
        <View style={styles.deviceHeader}>
          <View style={styles.deviceInfo}>
            <View style={styles.deviceTitleRow}>
              <Text style={styles.deviceName}>{activePairing.name}</Text>
              <View style={[styles.statusDot, { backgroundColor: activePairing.statusColor }]} />
            </View>
            <Text style={styles.deviceStatus}>{activePairing.statusText}</Text>
            <Text style={styles.deviceLastSeen}>{activePairing.lastSeen}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.connectButton,
              { backgroundColor: activePairing.closePairingStatusButtonColor },
            ]}
            onPress={onConnectDevice}
            disabled={activePairing.statusText === ''}
          >
            <Ionicons
              name={activePairing.statusIcon}
              size={20}
              color="#ffffff"
            />
          </TouchableOpacity>
        </View>

        {activePairing.isConnected && (
          <>
            {/* Device Stats */}
            <View style={styles.deviceStats}>
              <View style={styles.statItem}>
                <Ionicons name="battery-half" size={20} color="#10b981" />
                <Text style={styles.statValue}>{activePairing.batteryLevel}%</Text>
                <Text style={styles.statLabel}>Batterie</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="radio" size={20} color="#4f46e5" />
                <Text style={styles.statValue}>{activePairing.signalStrength}%</Text>
                <Text style={styles.statLabel}>Signal</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="code-working" size={20} color="#f59e0b" />
                <Text style={styles.statValue}>{activePairing.firmware}</Text>
                <Text style={styles.statLabel}>Firmware</Text>
              </View>
            </View>

            {/* Health Check */}
            <TouchableOpacity style={styles.healthCheckButton} onPress={onHealthCheck}>
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
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  deviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
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
    color: '#1f2937',
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
    color: '#9ca3af',
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
    marginBottom: 16,
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
    color: '#1f2937',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  healthCheckButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  healthCheckContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  healthCheckText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
});
