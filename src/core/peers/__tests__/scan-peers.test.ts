import { createTestStore, Store } from '../../../app/store/store';
import { FakePermissionProvider } from '../../permission/providers/test/fake-permission.provider';
import { createStateBuilder } from '../../store/state.builder';
import { FakePeerProvider } from '../providers/test/fake-peer.provider';
import { scanPeers } from '../usecases/scan-peers.usecase';

describe('FEATURE: Audie connects to a BLE device', () => {
    let peerProvider: FakePeerProvider;
    let permissionProvider: FakePermissionProvider;
    let store: Store;
    beforeEach(() => {
        peerProvider = new FakePeerProvider();
        permissionProvider = new FakePermissionProvider();
        store = createTestStore({ peerProvider, permissionProvider });
    });
    test('Scan peers and found device carpe-001', async () => {
        permissionProvider.schedulePermissionGranted({forFeature: 'scan-peers', permission: 'scan-bluetooth'});
        peerProvider.schedulePeerFound({
            id: 'peer0',
            name: 'carpe-001',
            rssi: -65,
            deviceType: 'lora_transceiver',
            firmware: '1.0.0',
            batteryLevel: 85,
            isSecured: false, // Pas de sécurité pour commencer
            lastSeen: new Date('2024-01-15T10:30:00.000Z'),
            signalStrength: 75,
        });
        await store.dispatch(scanPeers({ timeout: 100000 }));
        const expectedState = createStateBuilder().withAvailablePeerPeer({
            id: 'peer0',
            name: 'carpe-001',
            rssi: -65,
            deviceType: 'lora_transceiver',
            firmware: '1.0.0',
            batteryLevel: 85,
            isSecured: false,
            lastSeen: '2024-01-15T10:30:00.000Z',
            signalStrength: 75,
        })
            .withScanningPeer(false)
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
        const expectedState = createStateBuilder()
            .withPermissionByFeature('scan-peers', {
                id: 'scan-bluetooth',
                status: 'denied',
            })
            .withScanningPeer(false)
            .build();
        expect(peerProvider.scanWasCalled()).toBe(false);
        expect(store.getState()).toEqual(expectedState);
    });

});


