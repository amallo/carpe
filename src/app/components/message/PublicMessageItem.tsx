import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PublicMessageViewModel } from './PublicMessageList.viewmodel';
import { MessageIndicator } from './MessageIndicator';

interface PublicMessageItemProps {
  item: PublicMessageViewModel;
  getSignalBars: (signalStrength: number) => number;
  getRangeColor: (range: 'local' | 'medium' | 'long') => string;
  getRangeLabel: (range: 'local' | 'medium' | 'long') => string;
  formatDistance: (distance: number) => string;
}

export function PublicMessageItem({
  item,
  getSignalBars,
  getRangeColor,
  getRangeLabel,
  formatDistance: _formatDistance,
}: PublicMessageItemProps) {
  return (
    <View style={[styles.messageCard, item.isMe && styles.myMessageCard]}>
      <View style={styles.messageHeader}>
        <View style={styles.senderInfo}>
          <View style={[styles.senderAvatar, item.isMe && styles.myAvatar]}>
            <Text style={styles.avatarText}>{item.sentBy}</Text>
          </View>
          <View style={styles.senderDetails}>
            <Text style={[styles.senderName, item.isMe && styles.mySenderName]}>
              {item.isMe ? 'Moi' : item.sentBy}
            </Text>
            <Text style={styles.locationText}>📍 {item.location.name}</Text>
          </View>
        </View>

        <View style={styles.messageMetadata}>
          <Text style={styles.messageTime}>{item.timestamp}</Text>
          <View style={styles.signalContainer}>
            <View style={styles.signalBars}>
              {[1, 2, 3, 4].map(bar => (
                <View
                  key={bar}
                  style={[
                    styles.signalBar,
                    {
                      backgroundColor: bar <= getSignalBars(item.signalStrength)
                        ? getRangeColor(item.range)
                        : '#e5e7eb',
                      height: bar * 2 + 2,
                    },
                  ]}
                />
              ))}
            </View>
            <Text style={styles.signalText}>{item.signalStrength}%</Text>
          </View>
        </View>
      </View>

      <Text style={[styles.messageText, item.isMe && styles.myMessageText]}>
        {item.content}
      </Text>

      <View style={styles.messageFooter}>
        <View style={[styles.rangeTag, { backgroundColor: getRangeColor(item.range) }]}>
          <Text style={styles.rangeTagText}>{getRangeLabel(item.range)}</Text>
        </View>
        <MessageIndicator status={item.status} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  myMessageCard: {
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  senderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  myAvatar: {
    backgroundColor: '#0ea5e9',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  senderDetails: {
    flex: 1,
  },
  senderName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  mySenderName: {
    color: '#0ea5e9',
  },
  locationText: {
    fontSize: 12,
    color: '#6b7280',
  },
  messageMetadata: {
    alignItems: 'flex-end',
  },
  messageTime: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  signalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 4,
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
  messageText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  myMessageText: {
    color: '#0c4a6e',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rangeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  rangeTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  distanceText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
});
