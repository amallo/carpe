import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { toast } from 'sonner-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useOnboardingViewModel } from './onboarding.viewmodel';
import { OnboardingHeader } from './OnboardingHeader';

export default function OnboardingScreen() {
  const {
    nickname,
    isLoading,

    setNickname,
    createFirstIdentity,
    isButtonDisabled,
    charCount,
  } = useOnboardingViewModel();

  const handleSubmit = async () => {
    try {
      await createFirstIdentity();
      toast.success('Profil créé avec succès !');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la création du profil');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <OnboardingHeader />

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
            {charCount}/20 caractères
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isButtonDisabled}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Création...' : 'Créer mon profil'}
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
