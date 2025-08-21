import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ContactsScreen from '../screens/ContactsScreen';
import ChatScreen from '../screens/ChatScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import MyQRCodeScreen from '../screens/MyQRCodeScreen';
import BroadcastScreen from '../screens/BroadcastScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BluetoothScanScreen from '../screens/BluetoothScanScreen';
import PublicMessagesScreen from '../screens/PublicMessagesScreen';

const Stack = createNativeStackNavigator();

export const MainApp: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Contacts" component={ContactsScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      <Stack.Screen name="MyQRCode" component={MyQRCodeScreen} />
      <Stack.Screen name="Broadcast" component={BroadcastScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="BluetoothScan" component={BluetoothScanScreen} />
      <Stack.Screen name="PublicMessages" component={PublicMessagesScreen} />
    </Stack.Navigator>
  );
};
