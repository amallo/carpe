import { createStore } from '../../../store/create-store';
import { createStateBuilder } from '../../store/state.builder';
import { FakePeerProvider } from '../providers/fake/fake-peer.provider';

describe('FEATURE: Audie connects to a BLE device', () => {
    test('Scan peers and found device carpe-001', async ()=>{
        const peerProvider = new FakePeerProvider();
        peerProvider.schedulePeerScanned({
            id: 'peer0',
            name: 'carpe-001',
        });
        const store = createStore({peerProvider});
        await store.dispatch.peer.scan();
        const expectedState = createStateBuilder().withPeer({
            id: 'peer0',
            name: 'carpe-001',
        }).build();
        expect(store.getState()).toEqual(expectedState);
    });
});


