import { PairingFixture } from './pairing.fixture';
import { PeerError } from '../providers/peer.provider';
import { createStateBuilder } from '../../store/state.builder';

/**
 * @jest-environment node
 */
describe('FEATURE: Audie pair with a peer', () => {
    test('should pair and connect with a peer successfully', async () => {
        const fixture = new PairingFixture()
            .withPermissionGranted('connect-peers', 'connect-bluetooth');

        await fixture.pairPeer('peer-001');

        fixture
            .expectConnectToPeerWasCalled()
            .expectPeerConnected('peer-001')
            .expectPairedPeer('peer-001');
    });

    test('should not be paired if peer is not found', async () => {
        const fixture = new PairingFixture()
            .withPermissionGranted('connect-peers', 'connect-bluetooth');

        await fixture.pairPeer('non-existent-peer');

        fixture.expectPairingError(PeerError.PEER_NOT_FOUND);
        fixture.expectExists('non-existent-peer');
        fixture.expectDisconnectedPairedPeer('non-existent-peer');
    });

    test('paired peer should remains pairable when connection fails', async () => {
        // Initialize fixture with an existing paired peer
        const initialState = createStateBuilder()
            .withExistingPairedPeer('timeout-peer', 'disconnected')
            .withPermissionByFeature('connect-peers', {
                id: 'connect-bluetooth',
                status: 'granted',
            });

        const fixture = new PairingFixture({}, initialState)
            .withPermissionGranted('connect-peers', 'connect-bluetooth');

        await fixture.pairPeer('timeout-peer');

        // Verify peer exists and is disconnected (paired peers persist)
        fixture.expectExists('timeout-peer');
        fixture.expectDisconnectedPairedPeer('timeout-peer');
        
        // Verify error state
        const store = fixture.getStore();
        const state = store.getState();
        expect(state.pairing.error).toBe(PeerError.CONNECTION_TIMEOUT);
    });

    test('should fail when permission is denied', async () => {
        const fixture = new PairingFixture()
            .withPermissionDenied('connect-peers', 'connect-bluetooth');

        await fixture.pairPeer('peer-001');

        fixture.expectPermissionDeniedError();
    });
});
