import { FakePeerProvider } from '../providers/test/fake-peer.provider';
import { pairPeer } from '../usecases/pair-peer.usecase';
import { createStateBuilder, StateBuilder } from '../../store/state.builder';
import { PeerError } from '../providers/peer.provider';
import { FakePermissionProvider } from '../../permission/providers/test/fake-permission.provider';
import { createTestStore, Store } from '../../../app/store/store';
import { FeatureRequest } from '../../permission/providers/permission.provider';
import { Identity } from '../../identity/entities/identity.entity';

/**
 * @jest-environment node
 */
export class PairingFixture {
  private peerProvider: FakePeerProvider;
  private permissionProvider: FakePermissionProvider;
  private stateBuilder: StateBuilder;
  private store?: Store; // Store created lazily

  constructor(
    dependencies: {
      peerProvider?: FakePeerProvider;
      permissionProvider?: FakePermissionProvider;
    } = {},
    initialStateBuilder?: StateBuilder
  ) {
    this.peerProvider = dependencies.peerProvider || new FakePeerProvider();
    this.permissionProvider = dependencies.permissionProvider || new FakePermissionProvider();

    // Use provided StateBuilder or create a new one
    this.stateBuilder = initialStateBuilder || createStateBuilder();
    // Store created lazily when first action is called
    this.store = undefined;
  }

  withPermissionGranted(feature: FeatureRequest, permission: string): this {
    this.permissionProvider.schedulePermissionGranted({ forFeature: feature, permission });

    // Also add to initial state
    this.stateBuilder.withPermissionByFeature(feature, {
      id: permission,
      status: 'granted',
    });
    return this;
  }

  withPermissionDenied(feature: FeatureRequest, permission: string): this {
    this.permissionProvider.schedulePermissionDenied({ forFeature: feature, permission });

    // Also add to initial state
    this.stateBuilder.withPermissionByFeature(feature, {
      id: permission,
      status: 'denied',
    });
    return this;
  }

  /**
   * Configure initial identity in the state
   */
  withInitialIdentity(identity: Identity): this {
    this.stateBuilder.withCurrentIdentity(identity);
    return this;
  }

  /**
   * Configure initial connected peer in the state
   */
  withInitialConnectedPeer(peerId: string): this {
    this.stateBuilder.withConnectedPeer(peerId);
    return this;
  }

  /**
   * Configure initial available peer in the state
   */
  withInitialAvailablePeer(peer: { id: string; name: string; [key: string]: any }): this {
    this.stateBuilder.withAvailablePeerPeer(peer);
    return this;
  }

  /**
   * Configure initial scanning state
   */
  withInitialScanningState(isScanning: boolean): this {
    this.stateBuilder.withScanningPeer(isScanning);
    return this;
  }

  /**
   * Get or create the store with configured initial state
   * Store is created lazily when first needed
   */
  private getOrCreateStore(): Store {
    if (!this.store) {
      const initialState = this.stateBuilder.build();
      this.store = createTestStore({
        peerProvider: this.peerProvider,
        permissionProvider: this.permissionProvider,
      }, initialState);
    }
    return this.store;
  }

  async pairPeer(peerId: string): Promise<this> {
    const store = this.getOrCreateStore();
    await store.dispatch(pairPeer({ peerId }));
    return this;
  }

  expectPeerConnected(peerId: string): this {
    const store = this.getOrCreateStore();
    const expectedState = createStateBuilder()
      .withConnectedPeer(peerId)
      .withPermissionByFeature('connect-peers', {
        id: 'connect-bluetooth',
        status: 'granted',
      })
      .build();
    expect(store.getState()).toEqual(expectedState);
    return this;
  }

  expectPeerNotExists(peerId: string): this {
    const store = this.getOrCreateStore();
    const state = store.getState();
    
    // Check that peer is not in available peers
    const peerExists = state.peer.ids.includes(peerId);
    expect(peerExists).toBe(false);
    
    // Check that peer is not in connected peers
    const connectedPeerExists = state.pairing.ids.includes(peerId);
    expect(connectedPeerExists).toBe(false);
    
    return this;
  }

  expectPairedPeer(peerId: string): this {
    const store = this.getOrCreateStore();
    const expectedState = createStateBuilder()
      .withConnectedPeer(peerId)
      .withPermissionByFeature('connect-peers', {
        id: 'connect-bluetooth',
        status: 'granted',
      })
      .build();
    expect(store.getState()).toEqual(expectedState);
    return this;
  }

  expectPairedPeerNotExists(peerId: string): this {
    const store = this.getOrCreateStore();
    const state = store.getState();
    
    // For "not exists", we verify directly that the peer is not in the connected state
    // because building an expected state without a specific peer is more complex
    const pairingEntity = state.pairing.entities[peerId];
    
    // Either the entity doesn't exist or it's not in connected status
    if (pairingEntity) {
      expect(pairingEntity.status).not.toBe('connected');
    } else {
      expect(pairingEntity).toBeUndefined();
    }
    
    return this;
  }

  expectExists(peerId: string): this {
    const store = this.getOrCreateStore();
    const state = store.getState();
    
    // Check that peer exists in pairing entities (regardless of status)
    const pairingEntity = state.pairing.entities[peerId];
    expect(pairingEntity).toBeDefined();
    expect(state.pairing.ids).toContain(peerId);
    
    return this;
  }

  expectDisconnectedPairedPeer(peerId: string): this {
    const store = this.getOrCreateStore();
    const state = store.getState();
    
    // Check that peer exists but is not connected (failed connection)
    const pairingEntity = state.pairing.entities[peerId];
    expect(pairingEntity).toBeDefined();
    expect(pairingEntity?.status).not.toBe('connected');
    
    // For future: when we implement pairedPeers slice, we'll also check that
    // the peer remains in the paired peers list even if connection failed
    
    return this;
  }

  expectPairingError(error: PeerError): this {
    const store = this.getOrCreateStore();
    const state = store.getState();
    
    // Verify error is set
    expect(state.pairing.error).toBe(error);
    
    // Note: Peers now persist with 'disconnected' status on error
    // so we don't compare against a clean state anymore
    
    return this;
  }

  expectPermissionDeniedError(): this {
    const store = this.getOrCreateStore();
    const state = store.getState();
    
    // Verify error is set to permission denied
    expect(state.pairing.error).toBe(PeerError.PERMISSION_DENIED);
    
    // Verify permission status is denied
    const permissionEntity = state.permission.entities['connect-bluetooth'];
    expect(permissionEntity?.status).toBe('denied');
    
    return this;
  }

  expectConnectToPeerWasCalled(): this {
    expect(this.peerProvider.connectToPeerWasCalled()).toBe(true);
    return this;
  }

  getStore(): Store {
    return this.getOrCreateStore();
  }

  getPeerProvider(): FakePeerProvider {
    return this.peerProvider;
  }

  getPermissionProvider(): FakePermissionProvider {
    return this.permissionProvider;
  }
}
