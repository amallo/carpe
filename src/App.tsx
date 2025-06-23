  import { NavigationContainer } from '@react-navigation/native';
  import { createNativeStackNavigator } from '@react-navigation/native-stack';
  import { SafeAreaProvider } from 'react-native-safe-area-context';
  import { Toaster } from 'sonner-native';
  import HomeScreen from './app/screens/HomeScreen';
  import ContactsScreen from './app/screens/ContactsScreen';
  import ChatScreen from './app/screens/ChatScreen';
  import QRScannerScreen from './app/screens/QRScannerScreen';
  import MyQRCodeScreen from './app/screens/MyQRCodeScreen';
  import BroadcastScreen from './app/screens/BroadcastScreen';
  import SettingsScreen from './app/screens/SettingsScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BluetoothScanScreen from './app/screens/BluetoothScanScreen';
import PublicMessagesScreen from './app/screens/PublicMessagesScreen';
import { StoreProvider } from './app/store/store.context';

  const Stack = createNativeStackNavigator();

  function RootStack() {
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
  }

  export default function App() {
    return (
        <GestureHandlerRootView>
          <SafeAreaProvider>
              <NavigationContainer>

            <StoreProvider>
                  <RootStack />

            </StoreProvider>
              </NavigationContainer>
              <Toaster />
          </SafeAreaProvider>

        </GestureHandlerRootView>
    );
  }
