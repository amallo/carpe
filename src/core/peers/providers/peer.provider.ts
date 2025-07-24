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

export enum PeerError {
    PEER_NOT_FOUND = 'Peer not found',
    CONNECTION_FAILED = 'Connection failed',
    CONNECTION_TIMEOUT = 'Connection timeout',
    PERMISSION_DENIED = 'Permission denied',
    BLUETOOTH_DISABLED = 'Bluetooth is disabled',
    PEER_ALREADY_CONNECTED = 'Peer is already connected',
    PEER_NOT_CONNECTABLE = 'Peer is not connectable',
    AUTHENTICATION_FAILED = 'Authentication failed',
    SECURITY_REQUIRED = 'Security PIN required',
    SCAN_IN_PROGRESS = 'Scan is in progress',
    DEVICE_IN_AIRPLANE_MODE = 'Device is in airplane mode',
    INSUFFICIENT_RESOURCES = 'Insufficient system resources',
    LORA_FREQUENCY_NOT_ALLOWED = 'LoRa frequency not allowed in this region',
    LORA_POWER_EXCEEDED = 'LoRa transmission power exceeded',
    INTERFERENCE_DETECTED = 'LoRa interference detected'
}

export interface PeerProvider{
    /**
     * Scan for available peers
     * @throws {Error} BLUETOOTH_DISABLED - When Bluetooth is disabled
     * @throws {Error} PERMISSION_DENIED - When Bluetooth permission is denied
     * @throws {Error} SCAN_IN_PROGRESS - When a scan is already in progress
     */
    scan(): Promise<void>;
    
    /**
     * Stop the current scan
     */
    stopScan(): Promise<void>;
    /**
     * Connect to a specific peer
     * @param peerId - The ID of the peer to connect to
     * @throws {Error} PEER_NOT_FOUND - When the peer doesn't exist
     * @throws {Error} CONNECTION_FAILED - When connection fails
     * @throws {Error} CONNECTION_TIMEOUT - When connection times out
     * @throws {Error} PEER_ALREADY_CONNECTED - When peer is already connected
     * @throws {Error} PEER_NOT_CONNECTABLE - When peer doesn't accept connections
     * @throws {Error} AUTHENTICATION_FAILED - When authentication fails
     * @throws {Error} SECURITY_REQUIRED - When peer requires PIN
     * @throws {Error} BLUETOOTH_DISABLED - When Bluetooth is disabled
     * @throws {Error} PERMISSION_DENIED - When permission is denied
     */
    pairing(peerId: string): Promise<void>;
    onScanStopped(callback: () => void): void;
    onScanStarted(callback: () => void): void;
    onPeerFound(callback: (peer: PeerFound) => void): void;
    /**
     * Unpair/disconnect a peer physically (must be implemented)
     */
    unpair(peerId: string): Promise<void>;
}
