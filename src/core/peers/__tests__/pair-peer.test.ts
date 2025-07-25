import { createTestStore, Store } from '../../../app/store/store';
import { FakePeerProvider } from '../providers/test/fake-peer.provider';
import { pairPeer } from '../usecases/pair-peer.usecase';
import { createStateBuilder } from '../../store/state.builder';
import { PeerError } from '../providers/peer.provider';
import { FakePermissionProvider } from '../../permission/providers/test/fake-permission.provider';

describe('FEATURE: Audie connects to a peer', () => {
    let peerProvider: FakePeerProvider;
    let permissionProvider: FakePermissionProvider;
    let store: Store;

    beforeEach(() => {
        peerProvider = new FakePeerProvider();
        permissionProvider = new FakePermissionProvider();
        store = createTestStore({ peerProvider, permissionProvider });
    });

    test('should connect to peer successfully', async () => {
        permissionProvider.schedulePermissionGranted({forFeature: 'connect-peers', permission: 'connect-bluetooth'});
        await store.dispatch(pairPeer({ peerId: 'peer-001' }));
        expect(peerProvider.connectToPeerWasCalled()).toBe(true);
        const expectedState = createStateBuilder()
            .withPermissionByFeature('connect-peers', {
                id: 'connect-bluetooth',
                status: 'granted',
            })
            .withConnectedPeer('peer-001')
            .build();
        expect(store.getState()).toEqual(expectedState);
    });

    test('should fail when peer is not found', async () => {
        permissionProvider.schedulePermissionGranted({forFeature: 'connect-peers', permission: 'connect-bluetooth'});
        const nonExistentPeerId = 'non-existent-peer';
        await store.dispatch(pairPeer({ peerId: nonExistentPeerId }));
        const expectedState = createStateBuilder()
            .withPairingError(PeerError.PEER_NOT_FOUND)
            .withPermissionByFeature('connect-peers', {
                id: 'connect-bluetooth',
                status: 'granted',
            })
            .build();
        expect(store.getState()).toEqual(expectedState);
    });

    test('should fail when connection times out', async () => {
        permissionProvider.schedulePermissionGranted({forFeature: 'connect-peers', permission: 'connect-bluetooth'});
        await store.dispatch(pairPeer({ peerId: 'timeout-peer' }));
        const expectedState = createStateBuilder()
            .withPairingError(PeerError.CONNECTION_TIMEOUT)
            .withPermissionByFeature('connect-peers', {
                id: 'connect-bluetooth',
                status: 'granted',
            })
            .build();
        expect(store.getState()).toEqual(expectedState);
    });

    test('should fail when permission is denied', async () => {
        // Arrange: Permission refusée
        permissionProvider.schedulePermissionDenied({forFeature: 'connect-peers', permission: 'connect-bluetooth'});
        // Act: Tentative de connexion
        await store.dispatch(pairPeer({ peerId: 'peer-001' }));
        // Assert: Vérifier que l'erreur de permission est gérée
        const expectedState = createStateBuilder()
            .withPairingError(PeerError.PERMISSION_DENIED)
            .withPermissionByFeature('connect-peers', {
                id: 'connect-bluetooth',
                status: 'denied',
            })
            .build();
        expect(store.getState()).toEqual(expectedState);
    });
});
