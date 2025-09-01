
import { FakePeerProvider } from '../providers/test/fake-peer.provider';
import { createStateBuilder } from '../../store/state.builder';
import { createTestStore, Store } from '../../../app/store/store';
import { disconnectPairedPeer } from '../usecases/disconnect-paired-peer.usecase';

describe('disconnectPairedPeer', () => {
  let store: Store;
  let peerProvider: FakePeerProvider;

  beforeEach(() => {
    peerProvider = new FakePeerProvider();
  });

  test('should disconnect a connected paired peer', async () => {
    // Given: A connected paired peer
    const initialState = createStateBuilder()
      .withExistingPairedPeer('sensor-1', 'connected')
      .build();
    
    store = createTestStore({ peerProvider }, initialState);

    // When: Disconnecting the peer
    await store.dispatch(disconnectPairedPeer({ peerId: 'sensor-1' }));

    // Then: The peer is disconnected in the state
    const state = store.getState();
    const pairedPeer = state.pairedPeer.entities['sensor-1'];
    expect(pairedPeer?.status).toBe('disconnected');

    // And the provider was called
    expect(peerProvider.disconnectWasCalledWithPeerId('sensor-1')).toBe(true);
  });
});
