export type PeerFound = {
    id: string;
    name: string;
}

export interface PeerProvider{
    scan(): Promise<void>;
    stopScan(): Promise<void>;
    onScanStopped(callback: () => void): void;
    onScanStarted(callback: () => void): void;
    onPeerFound(callback: (peer: PeerFound) => void): void;
}
