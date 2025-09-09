import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { PublicMessageItem } from './PublicMessageItem';
import { PublicMessageViewModel, usePublicMessageListViewModel } from './PublicMessageList.viewmodel';

interface PublicMessageListProps {
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
  const { messages } = usePublicMessageListViewModel();
  const renderMessageItem = ({ item }: { item: PublicMessageViewModel }) => (
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
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={renderMessageItem}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.messagesList}

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
