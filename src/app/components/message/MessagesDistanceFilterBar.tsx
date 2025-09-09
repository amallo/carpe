import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

interface MessagesDistanceFilterBarProps {
  filterDistance: 'all' | 'local' | 'medium' | 'long';
  onFilterChange: (filter: 'all' | 'local' | 'medium' | 'long') => void;
  getRangeColor: (range: 'local' | 'medium' | 'long') => string;
  getRangeLabel: (range: 'local' | 'medium' | 'long') => string;
}

export function MessagesDistanceFilterBar({
  filterDistance,
  onFilterChange,
  getRangeColor,
  getRangeLabel,
}: MessagesDistanceFilterBarProps) {
  return (
    <View style={styles.filterBar}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {(['all', 'local', 'medium', 'long'] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              filterDistance === filter && styles.filterChipActive,
              filter !== 'all' && {
                borderColor: getRangeColor(filter),
                backgroundColor: filterDistance === filter ? getRangeColor(filter) : 'transparent',
              },
            ]}
            onPress={() => onFilterChange(filter)}
          >
            <Text style={[
              styles.filterChipText,
              filterDistance === filter && styles.filterChipTextActive,
              filter !== 'all' && filterDistance === filter && { color: '#ffffff' },
            ]}>
              {filter === 'all' ? 'Tous' : getRangeLabel(filter)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  filterBar: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterChipTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
