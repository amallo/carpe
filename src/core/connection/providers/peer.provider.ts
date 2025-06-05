export type PeerScanned = {
    id: string;
    name: string;
}

export interface PeerProvider{
    scan(): Promise<void>;
    onPeerScanned(callback: (peer: PeerScanned) => void): void;
}