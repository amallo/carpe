import { createTestStore, Store } from '../../../app/store/store';
import { createStateBuilder } from '../../store/state.builder';
import { unpairPeer } from '../usecases/unpair-peer.usecase';
import { FakePeerProvider } from '../providers/test/fake-peer.provider';

describe('FEATURE: Audie unpairs a peer', () => {
  let store: Store;
  let peerProvider: FakePeerProvider;

  beforeEach(() => {
    peerProvider = new FakePeerProvider();
    const initialState = createStateBuilder()
      .withAvailablePeerPeer({ id: 'peer-1', name: 'Peer 1' })
      .build();
    store = createTestStore({ peerProvider }, initialState);
  });

  test('should remove a peer from the paired list', async () => {
    await store.dispatch(unpairPeer('peer-1'));
    const expectedState = createStateBuilder().build();
    expect(store.getState()).toEqual(expectedState);
    expect(peerProvider.unpairWasCalledWithPeerId('peer-1')).toBe(true);
  });

  test('should do nothing if peer is not found', async () => {
    await store.dispatch(unpairPeer('peer-unknown'));
    const expectedState = createStateBuilder()
      .withAvailablePeerPeer({ id: 'peer-1', name: 'Peer 1' })
      .build();
    expect(store.getState()).toEqual(expectedState);
  });

}); 