
import { PeerProvider } from './peers/providers/peer.provider';
import { PermissionProvider } from './permission/providers/permission.provider';
import { Logger } from '../core/logger/providers/logger.interface';
import { IdentityIdGenerator } from './identity/generators/identity-id.generator';
import { KeyGenerator } from './identity/generators/key.generator';
import { VaultProvider } from './identity/providers/vault.provider';
import { AsyncStorageProvider } from './storage/providers/async-storage.provider';
import { MessageProvider } from './message/providers/message.provider';
import { MessageIdGenerator } from './message/providers/message-id.generator';

export interface Dependencies {
    peerProvider: PeerProvider;
    permissionProvider: PermissionProvider;
    logger: Logger;
    identityIdGenerator: IdentityIdGenerator;
    keyGenerator: KeyGenerator;
    vaultProvider: VaultProvider;
    storageProvider: AsyncStorageProvider;
    messageProvider: MessageProvider;
    messageIdGenerator: MessageIdGenerator;
}
