import { PairedPeerFixture } from './paire-peer.fixture';
import { PeerError } from '../providers/peer.provider';
import { createStateBuilder } from '../../store/state.builder';
import { PairedPeerMother } from './paired-peer.mother';

/**
 * @jest-environment node
 */
describe('FEATURE: Audie pair with a peer', () => {
    test('should pair and connect with a peer successfully', async () => {
        const fixedDate = '2024-01-15T10:30:45.123Z';
        const fixture = new PairedPeerFixture()
            .withPermissionGranted('connect-peers', 'connect-bluetooth')
            .withFakeDate(fixedDate)
            .withFakeDate(fixedDate); // Second call for peerWasConnected

        await fixture.pairPeer('peer-001');

        // Expected state after successful connection
        const expectedState = createStateBuilder()
            .withPermissionByFeature('connect-peers', {
                id: 'connect-bluetooth',
                status: 'granted',
            })
            .withExistingPairedPeer(PairedPeerMother.connected('peer-001', 1, fixedDate))
            .build();

        // Verify the actual state matches expected state
        const store = fixture.getStore();
        const actualState = store.getState();
        expect(actualState).toEqual(expectedState);
        
        // Also verify that connect was called
        fixture.expectConnectToPeerWasCalled();
    });

    test('should not be paired if peer is not found', async () => {
        const fixture = new PairedPeerFixture()
            .withPermissionGranted('connect-peers', 'connect-bluetooth');

        await fixture.pairPeer('non-existent-peer');

        fixture.expectPairingError(PeerError.PEER_NOT_FOUND);
        fixture.expectDisconnectedPairedPeer('non-existent-peer');
    });

    test('paired peer should remains pairable when connection fails', async () => {
        const fixedDate = '2024-01-15T10:30:45.123Z';
        
        // Initialize fixture with an existing paired peer
        const initialState = createStateBuilder()
            .withExistingPairedPeer(PairedPeerMother.disconnected('timeout-peer'))
            .withPermissionByFeature('connect-peers', {
                id: 'connect-bluetooth',
                status: 'granted',
            });

        const fixture = new PairedPeerFixture({}, initialState)
            .withPermissionGranted('connect-peers', 'connect-bluetooth')
            .withFakeDate(fixedDate);

        await fixture.pairPeer('timeout-peer');

        // Expected state after failed connection attempt
        const expectedState = createStateBuilder()
            .withPermissionByFeature('connect-peers', {
                id: 'connect-bluetooth',
                status: 'granted',
            })
            .withPairingError('Connection timeout')
            .withExistingPairedPeer(PairedPeerMother.disconnected('timeout-peer', 1, fixedDate))
            .build();

        // Verify the actual state matches expected state
        const store = fixture.getStore();
        const actualState = store.getState();
        expect(actualState).toEqual(expectedState);
    });

    test('should fail when permission is denied', async () => {
        const fixture = new PairedPeerFixture()
            .withPermissionDenied('connect-peers', 'connect-bluetooth');

        await fixture.pairPeer('peer-001');

        fixture.expectPermissionDeniedError();
    });
});
