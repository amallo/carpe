import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

export const HeaderProfile = ()=>{
    return <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name="chatbubble-ellipses" size={28} color="#fff" />
        <Text style={styles.headerTitle}> E-Chat</Text>
      </View>
      <TouchableOpacity>
        <Ionicons name="add-circle-outline" size={28} color="#fff" />
      </TouchableOpacity>
    </View>;
};


const styles = StyleSheet.create({
    header: {
      width: '100%',
      backgroundColor: '#2256A3',
      padding: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 30,
    },
    headerTitle: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 20,
      marginLeft: 8,
      fontStyle: 'italic',
    },
  });

