import { PairedPeerFixture } from './paire-peer.fixture';

/**
 * @jest-environment node
 */
describe('FEATURE: Auto-reconnection to paired devices', () => {
  describe('WHEN a known device becomes available again', () => {
    it('should automatically reconnect to maintain seamless communication', async () => {
      const fixture = new PairedPeerFixture()
        .withExistingPairedPeer('my-lora-sensor', 'disconnected')
        .withPermissionGranted('connect-peers', 'connect-bluetooth');
      
      // Device becomes visible during scan
      await fixture.simulatePeerFoundDuringScann('my-lora-sensor');
      
      // Should automatically trigger reconnection
      fixture.expectPairPeerWasCalled('my-lora-sensor');
      fixture.expectPairedPeer('my-lora-sensor');
    });

    it('should not reconnect to unknown devices', async () => {
      const fixture = new PairedPeerFixture()
        .withPermissionGranted('connect-peers', 'connect-bluetooth');
      
      // Unknown device becomes visible
      await fixture.simulatePeerFoundDuringScann('unknown-device');
      
      // Device should be discovered (in peers.slice) but not paired (not in pairedPeer.slice)
      const store = fixture.getStore();
      const state = store.getState();
      
      // Should be discovered during scan
      expect(state.peer.ids).toContain('unknown-device');
      
      // But should NOT be in paired peers (no auto-reconnection)
      expect(state.pairedPeer.ids).not.toContain('unknown-device');
    });

    it('should not reconnect to already connected paired devices', async () => {
      const fixture = new PairedPeerFixture()
        .withExistingPairedPeer('connected-sensor', 'connected')
        .withPermissionGranted('connect-peers', 'connect-bluetooth');
      
      // Already connected device is discovered again
      await fixture.simulatePeerFoundDuringScann('connected-sensor');
      
      // Should remain connected without additional pairing attempt
      const store = fixture.getStore();
      const state = store.getState();
      
      // Peer should still be connected (middleware should not trigger reconnection)
      expect(state.pairedPeer.entities['connected-sensor']?.status).toBe('connected');
      
      // Device should also be in discovered peers
      expect(state.peer.ids).toContain('connected-sensor');
    });
  });

  describe('WHEN user returns to the app', () => {
    it('should search for previously paired devices to restore connections', async () => {
      const fixture = new PairedPeerFixture()
        .withExistingPairedPeer('outdoor-sensor', 'disconnected')
        .withExistingPairedPeer('temperature-probe', 'disconnected')
        .withPermissionGranted('connect-peers', 'connect-bluetooth');
      
      // User returns to app (triggers connectivity scan request)
      await fixture.requestConnectivityScan();
      
      // Should trigger scan to find paired devices
      fixture.expectScanWasTriggered();
    });

    it('should scan even if no paired devices exist', async () => {
      const fixture = new PairedPeerFixture()
        .withPermissionGranted('connect-peers', 'connect-bluetooth');
      
      // Directly trigger connectivity scan (simulate app foreground with no paired devices)
      await fixture.requestConnectivityScan();
      
      // Middleware should still trigger scan (scanRequested always triggers scan)
      // This is correct behavior - let the scan discover any new devices
      fixture.expectScanWasTriggered();
    });
  });

  describe('WHEN device connection is lost unexpectedly', () => {
    it('should attempt to reconnect when device is rediscovered', async () => {
      const fixture = new PairedPeerFixture()
        .withExistingPairedPeer('temperature-probe', 'disconnected')
        .withPermissionGranted('connect-peers', 'connect-bluetooth');
      
      // Device comes back after restart/connection loss
      await fixture.simulatePeerFoundDuringScann('temperature-probe');
      
      // Should restore the trusted relationship
      fixture.expectPairPeerWasCalled('temperature-probe');
      fixture.expectPairedPeer('temperature-probe');
    });
  });
});
