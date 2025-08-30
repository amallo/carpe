import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IdentityPersistenceDebug } from '../components/IdentityPersistenceDebug';
import { isDevelopment } from '../config/environment';

/**
 * Developer utilities screen
 * Only accessible in development mode
 */
export default function DeveloperScreen() {
  // Redirect or show message if not in development
  if (!isDevelopment()) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notAvailable}>
          <Text style={styles.notAvailableText}>
            Écran développeur non disponible en production
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>🛠️ Outils Développeur</Text>
        
        {/* Identity Persistence Debug */}
        <IdentityPersistenceDebug />
        
        {/* Add other development tools here */}
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Autres outils de développement à ajouter...
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 20,
    textAlign: 'center',
  },
  notAvailable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notAvailableText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  placeholder: {
    backgroundColor: '#e9ecef',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
