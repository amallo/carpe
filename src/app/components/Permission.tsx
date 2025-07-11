import React, {  } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { StyleSheet } from 'react-native';
import { PermissionViewModel } from '../screens/BluetoothScanner.viewmodel';

type Props = {
    permission: PermissionViewModel
}

export const Permission = ({permission}: Props) => {

    return (<View style={styles.permissionsContainer}>
      <View style={styles.permissionIcon}>
        <Ionicons name={permission.icon as any} size={64} color="#4f46e5" />
      </View>

      <Text style={styles.permissionTitle}>
        Autorisation requise
      </Text>

      <Text style={styles.permissionText}>
        {permission.message}
      </Text>


      <TouchableOpacity
        style={styles.permissionButton}
        onPress={() => {
          permission.request();
         
        }}
      >
        <Text style={styles.permissionButtonText}>
          Autoriser l'accès
        </Text>
      </TouchableOpacity>
    </View>
    );
};

const styles = StyleSheet.create({
    permissionsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
      },
      permissionIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#f0f0ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
      },
      permissionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginTop: 16,
        marginBottom: 8,
      },
      permissionText: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
      },
      permissionNote: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 16,
      },
      permissionButton: {
        backgroundColor: '#4f46e5',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
      },
      permissionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
      },
});