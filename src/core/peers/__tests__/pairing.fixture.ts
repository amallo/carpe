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

    // Use StateBuilder pattern: verify against expected state structure
    // Peer should not exist in any peer collections
    expect(state.peer.ids).not.toContain(peerId);
    expect(state.pairedPeer.ids).not.toContain(peerId);

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

    // Use StateBuilder pattern: verify peer is not in connected state
    const pairedPeerEntity = state.pairedPeer.entities[peerId];
    if (pairedPeerEntity) {
      expect(pairedPeerEntity.status).not.toBe('connected');
    } else {
      expect(pairedPeerEntity).toBeUndefined();
    }

    return this;
  }

  expectDisconnectedPairedPeer(peerId: string): this {
    const store = this.getOrCreateStore();
    const state = store.getState();

    // Use StateBuilder pattern: verify disconnected peer state
    expect(state.pairedPeer.entities[peerId]).toBeDefined();
    expect(state.pairedPeer.entities[peerId]?.status).toBe('disconnected');

    return this;
  }

  expectPairingError(error: PeerError): this {
    const store = this.getOrCreateStore();
    const state = store.getState();

    // Use StateBuilder pattern: verify error state
    expect(state.pairedPeer.error).toBe(error);

    return this;
  }

  expectPermissionDeniedError(): this {
    const store = this.getOrCreateStore();
    const state = store.getState();

    // Use StateBuilder pattern: verify error and permission state
    expect(state.pairedPeer.error).toBe(PeerError.PERMISSION_DENIED);
    expect(state.permission.entities['connect-bluetooth']?.status).toBe('denied');

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
