import { createEntityAdapter, createSlice, EntityState, createSelector } from '@reduxjs/toolkit';
import {  messageWasSubmitted } from '../usecases/submit-message.usecase';
import { RootState } from '../../../app/store/store';
import { sendMessage } from '../usecases/send-message.usecase';

export interface MessageEntity {
    id: string;
    content: string;
    channel: 'public';
    sentBy: string;
    sentAt: string;
}


export type MessageState = EntityState<MessageEntity, string> & {
    submittedById: {[messageId: string] : string};
    broadcastedById: {[messageId: string] : string};
    submitted: string[];
    public: string[];
}

export const messageAdapter = createEntityAdapter<MessageEntity>();

export const getMessageInitialState = (): MessageState => ({
    ...messageAdapter.getInitialState(),
    broadcastedById: {},
    submittedById: {},
    submitted: [],
    public: [],
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
            state.public.push(action.payload.id);
        });
        builder.addCase(sendMessage.fulfilled, (state, action) => {
            const willSendMessageId = action.meta.arg;
            delete state.submittedById[willSendMessageId];
            state.submitted = state.submitted.filter(id => id !== willSendMessageId);
            state.broadcastedById[willSendMessageId] = willSendMessageId;
            // Keep message in public array - don't remove it
        });
    },
});

// Sélecteurs de base
export const selectMessageState = (state: RootState) => state.message;
const selectSubmittedIds = (state: RootState) => state.message.submitted;
export const selectBroadcastedById = (state: RootState) => state.message.broadcastedById;
export const selectSubmittedById = (state: RootState) => state.message.submittedById;
export const selectPublicMessageIds = (state: RootState) => state.message.public;

// Sélecteurs mémorisés
export const selectNextSubmittedMessage = createSelector(
  [selectMessageState, selectSubmittedIds],
  (messageState, submittedIds) => {
    if (submittedIds.length === 0) {
      return null;
    }

    const nextMessageId = submittedIds[0];
    return messageAdapter.getSelectors().selectById(messageState, nextMessageId) || null;
  }
);

export const selectAllSubmittedMessages = createSelector(
  [selectMessageState, selectSubmittedIds],
  (messageState, submittedIds) => {
    return submittedIds.map(id => messageAdapter.getSelectors().selectById(messageState, id)).filter(Boolean);
  }
);

export const selectMessageById = createSelector(
  [selectMessageState, (_: RootState, messageId: string) => messageId],
  (messageState, messageId) => {
    return messageAdapter.getSelectors().selectById(messageState, messageId) || null;
  }
);

export const selectAllPublicMessages = createSelector(
  [selectMessageState, (state: RootState) => state.message.public],
  (messageState, publicIds) => {
    return publicIds.map(id => messageAdapter.getSelectors().selectById(messageState, id)).filter(Boolean);
  }
);

export default messageSlice.reducer;
