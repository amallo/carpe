import { createAsyncThunk } from '@reduxjs/toolkit';
import { Dependencies } from '../../dependencies';
import { FakeMessageProvider } from '../providers/infra/fake-message.provider';

export const sendMessage = createAsyncThunk<void, string, { extra: Dependencies }>('message/sendMessage', 
    async (messageId: string, { extra }: {extra: Dependencies}) => {
        const messageProvider = new FakeMessageProvider();
        return messageProvider.send({
            id: messageId,
            content: 'toto',
            type: 'public',
            sentBy: 'audie',
        });
    }
);
