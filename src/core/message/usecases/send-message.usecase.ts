import { createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from '../../../app/store/store';
import { selectMessageById } from '../store/message.slice';

export const sendMessage = createAsyncThunk<void, string, AsyncThunkConfig>('message/sendMessage',
    async (messageId: string, { extra, getState }) => {
        const messageProvider = extra.messageProvider;
        const state = getState();
        const meesageReadyToSend = selectMessageById(state, messageId);
        if (!meesageReadyToSend) {
            throw new Error(`Message not found for id: ${messageId}`);
        }
        await messageProvider.send({
            id: meesageReadyToSend.id,
            content: meesageReadyToSend.content,
            type: meesageReadyToSend.channel,
            sentBy: meesageReadyToSend.sentBy,
            sentAt: meesageReadyToSend.sentAt,
        });
    }
);
