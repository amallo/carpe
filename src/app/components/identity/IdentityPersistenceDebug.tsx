import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppSelector } from '../../store/hooks';
import { selectCurrentIdentity, selectHasIdentity } from '../../../core/identity/store/identity.slice';
import { useIdentityPersistence } from '../../store/use-identity-persistence';
import { toast } from 'sonner-native';
import { isDevelopment } from '../../config/environment';

/**
 * Debug component for testing identity persistence
 * Shows current state and provides utilities to test persistence
 * Only renders in development mode
 */
export const IdentityPersistenceDebug: React.FC = () => {
  const currentIdentity = useAppSelector(selectCurrentIdentity);
  const hasIdentity = useAppSelector(selectHasIdentity);
  const {
    isRehydrated,
    persistVersion,
    clearPersistedData,
    hasPersistedData,
    debugPersistedState,
  } = useIdentityPersistence();

  // Only show in development mode
  if (!isDevelopment()) {
    return null;
  }

  const handleClearPersistence = async () => {
    try {
      await clearPersistedData();
      toast.success('Données persistées supprimées');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleCheckPersistence = async () => {
    try {
      const hasPersisted = await hasPersistedData();
      toast.success(`Données persistées: ${hasPersisted ? 'Oui' : 'Non'}`);
    } catch (error) {
      toast.error('Erreur lors de la vérification');
    }
  };

  const handleDebugPersistence = async () => {
    try {
      await debugPersistedState();
      toast.success('Logs de debug affichés dans la console');
    } catch (error) {
      toast.error('Erreur lors du debug');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Debug Persistance Identité (DEV ONLY)</Text>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          État: {isRehydrated ? '✅ Réhydraté' : '⏳ En cours...'}
        </Text>
        <Text style={styles.statusText}>
          Version: {persistVersion}
        </Text>
        <Text style={styles.statusText}>
          Identité: {hasIdentity ? '✅ Présente' : '❌ Absente'}
        </Text>
        {currentIdentity && (
          <Text style={styles.statusText}>
            Nickname: {currentIdentity.nickname}
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCheckPersistence}>
          <Text style={styles.buttonText}>Vérifier</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleDebugPersistence}>
          <Text style={styles.buttonText}>Debug</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={handleClearPersistence}>
          <Text style={[styles.buttonText, styles.dangerButtonText]}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 12,
    textAlign: 'center',
  },
  statusContainer: {
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  dangerButton: {
    backgroundColor: '#dc3545',
  },
  dangerButtonText: {
    color: '#ffffff',
  },
});
