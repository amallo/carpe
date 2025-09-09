import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { PublicMessageItem } from './PublicMessageItem';
import { PublicMessageViewModel, usePublicMessageListViewModel } from './PublicMessageList.viewmodel';

interface PublicMessage {
  id: string;
  sender: string;
  senderAvatar: string;
  message: string;
  timestamp: string;
  distance: number;
  signalStrength: number;
  location: {
    latitude: number;
    longitude: number;
    name: string;
  };
  range: 'local' | 'medium' | 'long';
  isMe?: boolean;
}

interface PublicMessageListProps {
  messages: PublicMessage[];
  flatListRef: React.RefObject<FlatList<PublicMessageViewModel> | null>;
  getSignalBars: (signalStrength: number) => number;
  getRangeColor: (range: 'local' | 'medium' | 'long') => string;
  getRangeLabel: (range: 'local' | 'medium' | 'long') => string;
  formatDistance: (distance: number) => string;
}

export function PublicMessageList({
  flatListRef,
  getSignalBars,
  getRangeColor,
  getRangeLabel,
  formatDistance,
}: PublicMessageListProps) {
  const viewModel = usePublicMessageListViewModel();
  const renderMessageItem = ({ item }: { item: PublicMessage }) => (
    <PublicMessageItem
      item={item}
      getSignalBars={getSignalBars}
      getRangeColor={getRangeColor}
      getRangeLabel={getRangeLabel}
      formatDistance={formatDistance}
    />
  );

  return (
    <FlatList
      ref={flatListRef}
      data={viewModel.messages}
      keyExtractor={(item) => item.id}
      renderItem={renderMessageItem}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.messagesList}
      inverted
    />
  );
}

const styles = StyleSheet.create({
  messagesList: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
});
