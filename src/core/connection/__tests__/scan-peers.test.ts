import { createTestStore, Store } from '../../../app/store/store';
import { FakePermissionProvider } from '../../permission/providers/test/fake-permission.provider';
import { createStateBuilder } from '../../store/state.builder';
import { FakePeerProvider } from '../providers/test/fake-peer.provider';
import { scanPeers } from '../store/peers.slice';

describe('FEATURE: Audie connects to a BLE device', () => {
    let peerProvider: FakePeerProvider;
    let permissionProvider: FakePermissionProvider;
    let store: Store;
    beforeEach(() => {
        jest.useFakeTimers();
        peerProvider = new FakePeerProvider();
        permissionProvider = new FakePermissionProvider();
        store = createTestStore({ peerProvider, permissionProvider });
    });
    afterEach(() => {
        jest.useRealTimers();
    });
    test('Scan peers and found device carpe-001', async () => {
        permissionProvider.schedulePermissionGranted({forFeature: 'scan-peers', permission: 'scan-bluetooth'});
        peerProvider.schedulePeerFound({
            id: 'peer0',
            name: 'carpe-001',
        });
        await store.dispatch(scanPeers({ timeout: 100000 }));
        jest.advanceTimersByTime(100000);
        const expectedState = createStateBuilder().withPeer({
            id: 'peer0',
            name: 'carpe-001',
        })
            .withScanLoading(false)
            .withPermissionByFeature('scan-peers', {
                id: 'scan-bluetooth',
                status: 'granted',
            })
            .build();
        expect(store.getState()).toEqual(expectedState);
    });
    test('Fail to scan peers when not enough permission', async () => {
        permissionProvider.schedulePermissionDenied({forFeature: 'scan-peers', permission: 'scan-bluetooth'});
        await store.dispatch(scanPeers({ timeout: 100000 }));
        jest.advanceTimersByTime(100000);
        const expectedState = createStateBuilder()
            .withPermissionByFeature('scan-peers', {
                id: 'scan-bluetooth',
                status: 'denied',
            })
            .withScanLoading(false)
            .build();
        expect(peerProvider.scanWasCalled()).toBe(false);
        expect(store.getState()).toEqual(expectedState);
    });

});


