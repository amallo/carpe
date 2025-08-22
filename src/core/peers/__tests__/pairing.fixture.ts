import { FakePeerProvider } from '../providers/test/fake-peer.provider';
import { pairPeer } from '../usecases/pair-peer.usecase';
import { createStateBuilder } from '../../store/state.builder';
import { PeerError } from '../providers/peer.provider';
import { FakePermissionProvider } from '../../permission/providers/test/fake-permission.provider';
import { createTestStore, Store } from '../../../app/store/store';
import { FeatureRequest } from '../../permission/providers/permission.provider';

/**
 * @jest-environment node
 */
export class PairingFixture {
  private peerProvider: FakePeerProvider;
  private permissionProvider: FakePermissionProvider;
  private store: Store;

  constructor(dependencies: {
    peerProvider?: FakePeerProvider;
    permissionProvider?: FakePermissionProvider;
  } = {}) {
    this.peerProvider = dependencies.peerProvider || new FakePeerProvider();
    this.permissionProvider = dependencies.permissionProvider || new FakePermissionProvider();

    this.store = createTestStore({
      peerProvider: this.peerProvider,
      permissionProvider: this.permissionProvider,
    });
  }

  withPermissionGranted(feature: FeatureRequest, permission: string): this {
    this.permissionProvider.schedulePermissionGranted({ forFeature: feature, permission });
    return this;
  }

  withPermissionDenied(feature: FeatureRequest, permission: string): this {
    this.permissionProvider.schedulePermissionDenied({ forFeature: feature, permission });
    return this;
  }

  async pairPeer(peerId: string): Promise<this> {
    await this.store.dispatch(pairPeer({ peerId }));
    return this;
  }

  expectPeerConnected(peerId: string): this {
    const expectedState = createStateBuilder()
      .withConnectedPeer(peerId)
      .withPermissionByFeature('connect-peers', {
        id: 'connect-bluetooth',
        status: 'granted',
      })
      .build();
    expect(this.store.getState()).toEqual(expectedState);
    return this;
  }

  expectPairingError(error: PeerError): this {
    const expectedState = createStateBuilder()
      .withPairingError(error)
      .withPermissionByFeature('connect-peers', {
        id: 'connect-bluetooth',
        status: 'granted',
      })
      .build();
    expect(this.store.getState()).toEqual(expectedState);
    return this;
  }

  expectPermissionDeniedError(): this {
    const expectedState = createStateBuilder()
      .withPairingError(PeerError.PERMISSION_DENIED)
      .withPermissionByFeature('connect-peers', {
        id: 'connect-bluetooth',
        status: 'denied',
      })
      .build();
    expect(this.store.getState()).toEqual(expectedState);
    return this;
  }

  expectConnectToPeerWasCalled(): this {
    expect(this.peerProvider.connectToPeerWasCalled()).toBe(true);
    return this;
  }

  getStore(): Store {
    return this.store;
  }

  getPeerProvider(): FakePeerProvider {
    return this.peerProvider;
  }

  getPermissionProvider(): FakePermissionProvider {
    return this.permissionProvider;
  }
}
