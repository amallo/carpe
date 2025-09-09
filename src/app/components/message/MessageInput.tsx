import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { toast } from 'sonner-native';
import { useAppDispatch } from '../../store/hooks';
import { submitMessage } from '../../../core/message/usecases/submit-message.usecase';

interface MessageInputProps {
  onMessageSent?: () => void;
}

export function MessageInput({
  onMessageSent,
}: MessageInputProps) {
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (message.trim().length === 0) {return;}

    setIsSending(true);

    try {
      await dispatch(submitMessage(message.trim())).unwrap();
      setMessage('');
      toast.success('Message soumis avec succès !');
      onMessageSent?.();
    } catch (error) {
      console.error('Error submitting message:', error);
      toast.error('Erreur lors de la soumission du message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.inputContainer}
    >
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder="Diffuser un message public..."
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
          placeholderTextColor="#9ca3af"
        />
        <TouchableOpacity
          style={[styles.sendButton, (message.trim().length === 0 || isSending) && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={message.trim().length === 0 || isSending}
        >
          <Ionicons
            name={isSending ? 'radio' : 'send'}
            size={20}
            color={(message.trim().length === 0 || isSending) ? '#94a3b8' : '#ffffff'}
          />
        </TouchableOpacity>
      </View>

      {/* Connection Status */}
      <View style={styles.connectionStatus}>
        <Ionicons name="radio" size={16} color="#22c55e" />
        <Text style={styles.connectionText}>Via LoRa • Diffusion publique</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 16,
  },
  connectionText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
});
