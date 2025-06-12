import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';

import { useNavigation, useRoute } from '@react-navigation/native';
import { toast } from 'sonner-native';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

interface Contact {
  id: string;
  name: string;
  status: 'online' | 'offline';
}

export default function ChatScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { contact } = route.params as { contact: Contact };
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Salut ! Comment ça va ?',
      timestamp: '14:30',
      isMe: false,
      status: 'read',
    },
    {
      id: '2',
      text: 'Ça va bien ! Et toi ?',
      timestamp: '14:32',
      isMe: true,
      status: 'delivered',
    },
    {
      id: '3',
      text: 'Parfait ! Tu es où en ce moment ?',
      timestamp: '14:33',
      isMe: false,
      status: 'read',
    },
    {
      id: '4',
      text: 'Je suis au parc, la connexion LoRa fonctionne parfaitement !',
      timestamp: '14:35',
      isMe: true,
      status: 'sent',
    },
  ]);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSendMessage = () => {
    if (message.trim().length === 0) {return;}

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      status: 'sending',
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate message status progression
    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
      ));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 2000);

    toast.success('Message envoyé via LoRa');
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <Ionicons name="time-outline" size={12} color="#94a3b8" />;
      case 'sent':
        return <Ionicons name="checkmark" size={12} color="#94a3b8" />;
      case 'delivered':
        return <Ionicons name="checkmark-done" size={12} color="#94a3b8" />;
      case 'read':
        return <Ionicons name="checkmark-done" size={12} color="#4f46e5" />;
      default:
        return null;
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.isMe ? styles.myMessage : styles.theirMessage]}>
      <View style={[styles.messageBubble, item.isMe ? styles.myBubble : styles.theirBubble]}>
        <Text style={[styles.messageText, item.isMe ? styles.myText : styles.theirText]}>
          {item.text}
        </Text>
        <View style={styles.messageFooter}>
          <Text style={[styles.messageTime, item.isMe ? styles.myTime : styles.theirTime]}>
            {item.timestamp}
          </Text>
          {item.isMe && (
            <View style={styles.messageStatus}>
              {getStatusIcon(item.status)}
            </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <View style={styles.contactAvatar}>
            <Text style={styles.avatarText}>
              {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Text>
          </View>
          <View style={styles.contactDetails}>
            <Text style={styles.contactName}>{contact.name}</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, {
                backgroundColor: contact.status === 'online' ? '#22c55e' : '#94a3b8',
              }]} />
              <Text style={styles.statusText}>
                {contact.status === 'online' ? 'En ligne' : 'Hors ligne'}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Tapez votre message..."
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity
            style={[styles.sendButton, message.trim().length === 0 && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={message.trim().length === 0}
          >
            <Ionicons
              name="send"
              size={20}
              color={message.trim().length === 0 ? '#94a3b8' : '#ffffff'}
            />
          </TouchableOpacity>
        </View>

        {/* Connection Status */}
        <View style={styles.connectionStatus}>
          <Ionicons name="radio" size={16} color="#22c55e" />
          <Text style={styles.connectionText}>Via LoRa • Chiffré</Text>
        </View>
      </KeyboardAvoidingView>
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
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#6b7280',
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  theirMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  myBubble: {
    backgroundColor: '#4f46e5',
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myText: {
    color: '#ffffff',
  },
  theirText: {
    color: '#111827',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 12,
    marginRight: 4,
  },
  myTime: {
    color: '#e0e7ff',
  },
  theirTime: {
    color: '#6b7280',
  },
  messageStatus: {
    marginLeft: 4,
  },
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
