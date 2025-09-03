import { createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';
import { scheduleBroadcastMessage, schedulingSendMessageAction } from '../usecases/schedule-broadcast-message.usecase';
import { RootState } from '../../../app/store/store';
import { sendMessage } from '../usecases/send-message.usecase';

export interface MessageEntity {
    id: string;
    content: string;
    type: 'public';
    sentBy: string;
}

const createMessageEntity = ({id, content, type, sentBy}: {id: string, content: string, type: 'public', sentBy: string} ): MessageEntity => ({
    id,
    content,
    type,
    sentBy,
});

export type MessageState = {
    pending: EntityState<MessageEntity, string>;
    broadcasted: EntityState<MessageEntity, string>;
}

export const messageAdapter = createEntityAdapter<MessageEntity>();

export const getMessageInitialState = (): MessageState => ({
    pending: messageAdapter.getInitialState(),
    broadcasted: messageAdapter.getInitialState(),
});

const messageSlice = createSlice({
    name: 'message',
    initialState : getMessageInitialState(),
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(scheduleBroadcastMessage.fulfilled, (state, action) => {
            messageAdapter.addOne(state.pending, createMessageEntity({id: 'mesage-1', content: action.meta.arg, type: 'public', sentBy: 'audie'}));
        });
        builder.addCase(schedulingSendMessageAction, (state, action) => {
            const willSendMessage = action.payload;
            messageAdapter.removeOne(state.pending, willSendMessage.id);
            messageAdapter.addOne(state.broadcasted, willSendMessage);
        });
    },
})

export const selectNextPendingMessage = (state: RootState) : MessageEntity | null => {
    const pendingMessageIds = state.message.pending.ids;
    if (pendingMessageIds.length === 0) {
        return null;
    }
    const nextMessageId = pendingMessageIds[0];
    return state.message.pending.entities[nextMessageId] || null;

};

export default messageSlice.reducer;
