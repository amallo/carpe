import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectPeerById } from '../../../core/peers/store/peers.slice';
import { PairedPeerStatus, selectActivePairedPeers, selectPairedPeerError } from '../../../core/peers/store/paired-peer.slice';
import { createSelector } from '@reduxjs/toolkit';
import { useState, useCallback } from 'react';
import { LogEntry } from '../../../core/logger/store/log.slice';
import { unpairPeer } from '../../../core/peers/usecases/unpair-peer.usecase';

export interface ActivePairingViewModel {
  id: string;
  name: string;
  statusText: string
  isConnected: Readonly<boolean>;
  statusColor: string;
  statusIcon: 'bluetooth' | 'close';
  status: PairedPeerStatus;
  batteryLevel: number;
  signalStrength: number;
  lastSeen: string;
  publicKey: string;
  firmware: string;
  closePairingStatusButtonColor: string;
}

export interface LogEntryViewModel {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
}

const getActivePairingStatusText = (activePairingStatus: PairedPeerStatus) => {
  switch (activePairingStatus) {
    case 'connected': return 'Connecté';
    case 'pending': return 'Connexion...';
    //case 'error': return 'Erreur';
    default: return 'Inconnu';
  }
};

const getActivePairingStatusColor = (activePairingStatus: PairedPeerStatus) => {
  switch (activePairingStatus) {
    case 'connected': return '#10b981';
    case 'pending': return '#f59e0b';
    case 'disconnected': return '#6b7280';
    //case 'error': return '#ef4444';
    default: return '#6b7280';
  }
};


const getClosePairingStatusButtonColor = (activePairingStatus: PairedPeerStatus) => {
  switch (activePairingStatus) {
    case 'connected': return '#ef4444';
    default: return '#10b981';
  }
};

const getActivePairingStatusIcon = (activePairingStatus: PairedPeerStatus) => {
  switch (activePairingStatus) {
    case 'connected': return 'close';
    default: return 'bluetooth';
  }
};

const selectActivePairingViewModel = createSelector(
  [selectActivePairedPeers, selectPeerById],
  (activePairing, peerById) : ActivePairingViewModel[] => {
    return activePairing.map((pairing) => {
      return {
        statusText: getActivePairingStatusText(pairing.status),
        statusColor: getActivePairingStatusColor(pairing.status),
        id: pairing.id,
        name: peerById[pairing.id]?.name || 'Inconnu',
        batteryLevel: peerById[pairing.id]?.batteryLevel || 0,
        signalStrength: peerById[pairing.id]?.signalStrength || 0,
        lastSeen: peerById[pairing.id]?.lastSeen || 'Jamais connecté',
        publicKey:  '',
        firmware: peerById[pairing.id]?.firmware || 'Inconnu2',
        statusIcon: getActivePairingStatusIcon(pairing.status),
        isConnected: pairing.status === 'connected',
        status: pairing.status,
        closePairingStatusButtonColor: getClosePairingStatusButtonColor(pairing.status),
      };
    });
  }
);

export const selectLogEntries = (state: any) => state.log.logs as LogEntry[];

export const selectLogEntryViewModels = createSelector(
  [selectLogEntries],
  (logs): LogEntryViewModel[] =>
    logs
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(log => ({
        id: log.id,
        timestamp: new Date(log.date).toLocaleTimeString('fr-FR'),
        level: log.severity as 'info' | 'warning' | 'error',
        message: `[${log.domaine}] ${log.message}`,
      }))
);

export const useSettingsViewModel = () : {activePairing: ActivePairingViewModel, error: string | null, disconnectPeer: (peerId: string) => Promise<void>, disconnecting: boolean, disconnectError: string | null, logs: LogEntryViewModel[]} => {
  const activePairing = useAppSelector(selectActivePairingViewModel);
  const error = useAppSelector(selectPairedPeerError);
  const dispatch = useAppDispatch();
  const [disconnecting, setDisconnecting] = useState(false);
  const [disconnectError, setDisconnectError] = useState<string | null>(null);
  const logs = useAppSelector(selectLogEntryViewModels);

  const handleDisconnectPeer = useCallback(async (peerId: string) => {
    setDisconnecting(true);
    setDisconnectError(null);
    try {
      await dispatch(unpairPeer(peerId)).unwrap();
    } catch (e: any) {
      setDisconnectError(e.message || 'Erreur lors de la déconnexion');
    } finally {
      setDisconnecting(false);
    }
  }, [dispatch]);

  return {
    // Données du state via selectors
    activePairing : activePairing.length > 0 ? activePairing[0] :  {
      id: 'no_device',
      name: 'Aucun appareil connecté',
      statusText: getActivePairingStatusText('disconnected'),
      batteryLevel: 0,
      signalStrength: 0,
      lastSeen: 'Jamais connecté',
      publicKey: '',
      firmware: 'Inconnu',
      statusColor: getActivePairingStatusColor('disconnected'),
      statusIcon: 'bluetooth',
      isConnected: false,
      status: 'disconnected',
      closePairingStatusButtonColor: '#10b981',
    },
    error,
    disconnectPeer: handleDisconnectPeer,
    disconnecting,
    disconnectError,
    logs,
  };
};
