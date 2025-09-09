import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Dependencies } from '../../dependencies';
import { MessageEntity } from '../store/message.slice';
import { AppDispatch, RootState } from '../../../app/store/store';
import { selectCurrentIdentity } from '../../identity/store/identity.slice';

export const submitMessage = createAsyncThunk<void, string, { extra: Dependencies, dispatch: AppDispatch, state: RootState }>('message/willBroadcastMessage',
    async (message: string, {  dispatch, extra, getState }: {extra: Dependencies, dispatch: AppDispatch, getState: () => RootState}) => {
        const messageIdGenerator = extra.messageIdGenerator;
        const state = getState();
        const identity = selectCurrentIdentity(state);
        const willGenerateMessageId = messageIdGenerator.generate();
        const now = extra.dateProvider.now();

        const willSubmitMessage : MessageEntity = {
            id: willGenerateMessageId,
            content: message,
            channel: 'public',
            sentBy: identity!.id,
            sentAt: now,
        };
        dispatch(messageWasSubmitted(willSubmitMessage));
    });

export const messageWasSubmitted = createAction<MessageEntity>('message/schedulingSendMessage');
