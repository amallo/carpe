
import { PeerProvider } from './peers/providers/peer.provider';
import { PermissionProvider } from './permission/providers/permission.provider';

export interface Dependencies {
    peerProvider: PeerProvider;
    permissionProvider: PermissionProvider;
}
