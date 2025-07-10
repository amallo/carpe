export type PeerFound = {
    id: string;
    name: string;
    // Propriétés BLE standard
    rssi?: number;                    // Signal strength indicator
    advertising?: any;                 // Advertising data
    manufacturerData?: string;         // Manufacturer specific data
    serviceUUIDs?: string[];          // Array of service UUIDs
    txPowerLevel?: number;            // Transmission power level
    isConnectable?: boolean;          // Whether the device is connectable
    localName?: string;               // Local name of the device
    txPower?: number;                 // Transmission power
    overflowServiceUUIDs?: string[];  // Overflow service UUIDs
    solicitedServiceUUIDs?: string[]; // Solicited service UUIDs
    serviceData?: Record<string, string>; // Service data
    // Propriétés spécifiques LoRa
    deviceType?: 'lora_transceiver' | 'lora_gateway' | 'lora_node';
    firmware?: string;                // Firmware version
    batteryLevel?: number;            // Battery level (0-100)
    isSecured?: boolean;              // Whether the device requires PIN
    lastSeen?: Date;                  // Last time the device was seen (will be converted to ISO string)
    // Propriétés calculées
    distance?: number;                // Calculated distance in meters
    signalStrength?: number;          // Calculated signal strength (0-100)
}

export interface PeerProvider{
    scan(): Promise<void>;
    stopScan(): Promise<void>;
    onScanStopped(callback: () => void): void;
    onScanStarted(callback: () => void): void;
    onPeerFound(callback: (peer: PeerFound) => void): void;
}
