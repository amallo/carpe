import { createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';
import {  messageWasSubmitted } from '../usecases/submit-broadcast-message.usecase';
import { RootState } from '../../../app/store/store';
import { sendMessage } from '../usecases/send-message.usecase';

export interface MessageEntity {
    id: string;
    content: string;
    type: 'public';
    sentBy: string;
    sentAt: string;
}

const createMessageEntity = ({id, content, type, sentBy, sentAt}: {id: string, content: string, type: 'public', sentBy: string, sentAt: string} ): MessageEntity => ({
    id,
    content,
    type,
    sentBy,
    sentAt,
});

export type MessageState = {
    submittedMessages: EntityState<MessageEntity, string>;
    broadcastedMessages: EntityState<MessageEntity, string>;
}

export const messageAdapter = createEntityAdapter<MessageEntity>();

export const getMessageInitialState = (): MessageState => ({
    submittedMessages: messageAdapter.getInitialState(),
    broadcastedMessages: messageAdapter.getInitialState(),
});

const messageSlice = createSlice({
    name: 'message',
    initialState : getMessageInitialState(),
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(messageWasSubmitted, (state, action) => {
            messageAdapter.addOne(state.submittedMessages, action.payload);
        });
        builder.addCase(sendMessage.fulfilled, (state, action) => {
            const willSendMessageId = action.meta.arg;
            const willSendMessage = messageAdapter.getSelectors().selectById(state.submittedMessages, willSendMessageId);
            messageAdapter.removeOne(state.submittedMessages, willSendMessage.id);
            messageAdapter.addOne(state.broadcastedMessages, willSendMessage);
        });
    },
})

export const selectNextSubmittedMessage = (state: RootState) : MessageEntity | null => {
    const submittedMessageIds = state.message.submittedMessages.ids;
    console.log('submittedMessageIds', submittedMessageIds);
    if (submittedMessageIds.length === 0) {
        return null;
    }
    const nextMessageId = submittedMessageIds[0];
    return state.message.submittedMessages.entities[nextMessageId] || null;
};

export const selectSubmittedMessageById = (state: RootState, messageId: string) : MessageEntity | null => {
    return state.message.submittedMessages.entities[messageId] || null;
};

export default messageSlice.reducer;
