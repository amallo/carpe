import {  createTestStore, Store } from '../../../app/store/create-store';
import { FakePermissionProvider } from '../../permission/providers/test/fake-permission.provider';
import { createStateBuilder } from '../../store/state.builder';
import { FakePeerProvider } from '../providers/test/fake-peer.provider';

describe('FEATURE: Audie connects to a BLE device', () => {
    let peerProvider: FakePeerProvider;
    let permissionProvider: FakePermissionProvider;
    let store: Store;
    beforeEach(()=>{
        jest.useFakeTimers();
        peerProvider = new FakePeerProvider();
        permissionProvider = new FakePermissionProvider();
        store = createTestStore({peerProvider, permissionProvider});
    });
    afterEach(()=>{
        jest.useRealTimers();
    });
    test('Scan peers and found device carpe-001', async ()=>{
        permissionProvider.schedulePermissionGranted('scan-peers');
        peerProvider.schedulePeerFound({
            id: 'peer0',
            name: 'carpe-001',
        });
        await store.dispatch.peer.scan({timeout: 100000});
        jest.advanceTimersByTime(100000);
        const expectedState = createStateBuilder().withPeer({
            id: 'peer0',
            name: 'carpe-001',
        })
        .withScanLoading(false)
        .withPermission({
            'scan-peers': 'granted',
        })
        .build();
        expect(store.getState()).toEqual(expectedState);
    });
    test('Fail to scan peers without permission', async ()=>{
        permissionProvider.schedulePermissionDenied('scan-peers');
        await store.dispatch.peer.scan({timeout: 100000});
        jest.advanceTimersByTime(100000);
        const expectedStateAfterScan = createStateBuilder()
            .withPermission({
                'scan-peers': 'denied',
            })
            .withScanLoading(false)
            .build();
        expect(peerProvider.scanWasCalled()).toBe(false);
        expect(store.getState()).toEqual(expectedStateAfterScan);
    });

});


