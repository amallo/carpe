import { createTestStore } from '../../../app/store/store';
import { createStateBuilder } from '../../store/state.builder';
import { FakePermissionProvider } from '../providers/test/fake-permission.provider';
import { requestPermission } from '../usecases/request-permission.usecase';

describe('Audie request permissions', () => {
    test('Audie accept request to scan bluetooth', async () => {
        const permissionProvider = new FakePermissionProvider();
        permissionProvider.schedulePermissionGranted({forFeature: 'scan-peers', permission: 'scan-bluetooth'});
        const store = createTestStore({ permissionProvider });
        await store.dispatch(requestPermission({permissionId: 'scan-bluetooth'}));
        const expectedState = createStateBuilder().withPermissionByFeature('scan-peers', {
            id: 'scan-bluetooth',
            status: 'granted',
        }).build();
        expect(store.getState()).toEqual(expectedState);
    });
});
