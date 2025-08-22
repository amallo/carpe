import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

interface OnboardingHeaderProps {
  title?: string;
  subtitle?: string;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  title = 'Bienvenue sur LoRa Mesh',
  subtitle = 'Créez votre profil pour commencer à communiquer de manière décentralisée',
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Ionicons name="radio" size={60} color="#4DB6FF" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
});
