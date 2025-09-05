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

export type MessageState = EntityState<MessageEntity, string> & {
    broadcasted: string[];
    submittedById: {[messageId: string] : string};
    submitted: string[];
}

export const messageAdapter = createEntityAdapter<MessageEntity>();

export const getMessageInitialState = (): MessageState => ({

    ...messageAdapter.getInitialState(),
    broadcasted:  [],
    submittedById: {},
    submitted: [],
});

const messageSlice = createSlice({
    name: 'message',
    initialState : getMessageInitialState(),
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(messageWasSubmitted, (state, action) => {
            messageAdapter.addOne(state, action.payload);
            state.submittedById[action.payload.id] = action.payload.id;
            state.submitted.push(action.payload.id);
        });
        builder.addCase(sendMessage.fulfilled, (state, action) => {
            const willSendMessageId = action.meta.arg;
            delete state.submittedById[willSendMessageId];
            state.submitted = state.submitted.filter(id => id !== willSendMessageId);
            state.broadcasted.push(willSendMessageId);
        });
    },
});

export const selectNextSubmittedMessage = (state: RootState) : MessageEntity | null => {
    const nextSubmittedMessageId = state.message.submitted.length > 0 ? state.message.submitted[0] : null;
    return messageAdapter.getSelectors().selectById(state.message, nextSubmittedMessageId!) || null;
};

export const selectMessageById = (state: RootState, messageId: string) : MessageEntity | null => {
    return messageAdapter.getSelectors().selectById(state.message, messageId) || null;
};

export default messageSlice.reducer;
