
import { PeerProvider } from './peers/providers/peer.provider';
import { PermissionProvider } from './permission/providers/permission.provider';
import { Logger } from '../core/logger/providers/logger.interface';

export interface Dependencies {
    peerProvider: PeerProvider;
    permissionProvider: PermissionProvider;
    logger: Logger;
}
