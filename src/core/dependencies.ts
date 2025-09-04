
import { PeerProvider } from './peers/providers/peer.provider';
import { PermissionProvider } from './permission/providers/permission.provider';
import { Logger } from '../core/logger/providers/logger.interface';
import { IdentityIdGenerator } from './identity/generators/identity-id.generator';
import { IdentityKeyPairGenerator } from './identity/generators/identity-key-pair.generator';
import { AsyncStorageProvider } from './storage/providers/async-storage.provider';
import { MessageProvider } from './message/providers/message.provider';
import { MessageIdGenerator } from './message/providers/message-id.generator';
import { IdentityKeyPairProvider } from './identity/providers/identity-key-pair.provider';

export interface Dependencies {
    peerProvider: PeerProvider;
    permissionProvider: PermissionProvider;
    logger: Logger;
    identityIdGenerator: IdentityIdGenerator;
    keyGenerator: IdentityKeyPairGenerator;
    vaultProvider: IdentityKeyPairProvider;
    storageProvider: AsyncStorageProvider;
    messageProvider: MessageProvider;
    messageIdGenerator: MessageIdGenerator;
}
