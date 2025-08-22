import { PairingFixture } from './pairing.fixture';
import { PeerError } from '../providers/peer.provider';

/**
 * @jest-environment node
 */
describe('FEATURE: Audie connects to a peer', () => {
    test('should connect to peer successfully', async () => {
        const fixture = new PairingFixture()
            .withPermissionGranted('connect-peers', 'connect-bluetooth');

        await fixture.pairPeer('peer-001');

        fixture
            .expectConnectToPeerWasCalled()
            .expectPeerConnected('peer-001');
    });

    test('should fail when peer is not found', async () => {
        const fixture = new PairingFixture()
            .withPermissionGranted('connect-peers', 'connect-bluetooth');

        await fixture.pairPeer('non-existent-peer');

        fixture.expectPairingError(PeerError.PEER_NOT_FOUND);
    });

    test('should fail when connection times out', async () => {
        const fixture = new PairingFixture()
            .withPermissionGranted('connect-peers', 'connect-bluetooth');

        await fixture.pairPeer('timeout-peer');

        fixture.expectPairingError(PeerError.CONNECTION_TIMEOUT);
    });

    test('should fail when permission is denied', async () => {
        const fixture = new PairingFixture()
            .withPermissionDenied('connect-peers', 'connect-bluetooth');

        await fixture.pairPeer('peer-001');

        fixture.expectPermissionDeniedError();
    });
});
