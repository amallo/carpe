import { createAsyncThunk } from '@reduxjs/toolkit';
import { Dependencies } from '../../dependencies';
import { PermissionEntity, setPermission } from '../store/permission.slice';

// Async thunk for scanning peers
export const requestPermission = createAsyncThunk<
    void,
    { permissionId: string },
    { extra: Dependencies }
>(
    'permission/request',
    async ({ permissionId }, { dispatch, extra: {  permissionProvider } }) => {
        /**
         * Request permission to scan for peers
         */
        const permissionStatus = await permissionProvider.requestSinglePermission(permissionId);
        const permission : PermissionEntity = {
            id: permissionId,
            status: permissionStatus,
        }
        dispatch(setPermission(permission));
    }
);
