import { createAsyncThunk } from '@reduxjs/toolkit';
import { Dependencies } from '../../dependencies';
import { Identity } from '../entities/identity.entity';

interface CreateIdentityRequest {
    nickname: string;
}

export const createIdentity = createAsyncThunk<
    Identity,
    CreateIdentityRequest,
    {
        extra: Dependencies;
    }
>(
    'identity/createIdentity',
    async ({nickname}: CreateIdentityRequest, { extra }) => {
        const { identityIdGenerator, keyGenerator, vaultProvider } = extra;
        const generatedIdentityId = identityIdGenerator.generate({nickname});
        const generatedKeyPair = await keyGenerator.generate();
        await vaultProvider.store('identity', generatedKeyPair);

        return {
            id: generatedIdentityId,
            nickname,
            publicKey: generatedKeyPair.publicKey,
        };
    }
);
