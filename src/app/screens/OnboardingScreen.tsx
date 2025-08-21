import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { toast } from 'sonner-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useUser } from '../providers/UserProvider';

export default function OnboardingScreen() {
  const [nickname, setNickname] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { createUser } = useUser();

  const handleCreateProfile = async () => {
    try {
      setIsCreating(true);
      await createUser(nickname);
    } catch (error) {
      // L'erreur est déjà gérée par le UserProvider
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="radio" size={60} color="#4DB6FF" />
        </View>
        <Text style={styles.title}>Bienvenue sur LoRa Mesh</Text>
        <Text style={styles.subtitle}>
          Créez votre profil pour commencer à communiquer de manière décentralisée
        </Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Votre nickname</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Alice, Bob, etc."
            value={nickname}
            onChangeText={setNickname}
            maxLength={20}
            autoFocus
            autoCapitalize="words"
          />
          <Text style={styles.hint}>
            Ce nom sera visible par les autres utilisateurs du réseau LoRa
          </Text>
          <Text style={styles.charCount}>
            {nickname.length}/20 caractères
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, isCreating && styles.buttonDisabled]}
          onPress={handleCreateProfile}
          disabled={isCreating}
        >
          <Text style={styles.buttonText}>
            {isCreating ? 'Création...' : 'Créer mon profil'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Features Preview */}
      <View style={styles.features}>
        <Text style={styles.featuresTitle}>Ce que vous pourrez faire :</Text>
        <View style={styles.featureItem}>
          <Ionicons name="chatbubbles-outline" size={20} color="#4DB6FF" />
          <Text style={styles.featureText}>Communiquer avec vos contacts</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="radio-outline" size={20} color="#4DB6FF" />
          <Text style={styles.featureText}>Participer au réseau LoRa Mesh</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="qr-code-outline" size={20} color="#4DB6FF" />
          <Text style={styles.featureText}>Partager votre QR code</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Votre identifiant unique sera généré automatiquement
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EAF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 3,
    borderColor: '#4DB6FF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 10,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#4DB6FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  features: {
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 16,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
  footer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
