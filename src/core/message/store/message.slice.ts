import { createEntityAdapter, createSlice, EntityState, createSelector } from '@reduxjs/toolkit';
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

// Sélecteurs de base
const selectMessageState = (state: RootState) => state.message;
const selectSubmittedIds = (state: RootState) => state.message.submitted;
const selectBroadcastedIds = (state: RootState) => state.message.broadcasted;

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

export const selectMessageById = createSelector(
  [selectMessageState, (state: RootState, messageId: string) => messageId],
  (messageState, messageId) => {
    return messageAdapter.getSelectors().selectById(messageState, messageId) || null;
  }
);

export const selectSubmittedMessageById = createSelector(
  [selectMessageState, (state: RootState, messageId: string) => messageId],
  (messageState, messageId) => {
    return messageAdapter.getSelectors().selectById(messageState, messageId) || null;
  }
);

export const selectBroadcastedMessageById = createSelector(
  [selectMessageState, (state: RootState, messageId: string) => messageId],
  (messageState, messageId) => {
    return messageAdapter.getSelectors().selectById(messageState, messageId) || null;
  }
);

// Sélecteur composé pour les statistiques
export const selectMessageStats = createSelector(
  [selectSubmittedIds, selectBroadcastedIds],
  (submittedIds, broadcastedIds) => ({
    submittedCount: submittedIds.length,
    broadcastedCount: broadcastedIds.length,
    totalCount: submittedIds.length + broadcastedIds.length,
  })
);

export default messageSlice.reducer;
