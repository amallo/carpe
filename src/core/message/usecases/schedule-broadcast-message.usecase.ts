import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Dependencies } from '../../dependencies';
import { MessageEntity } from '../store/message.slice';
import { AppDispatch } from '../../../app/store/store';

export const scheduleBroadcastMessage = createAsyncThunk<void, string, { extra: Dependencies, dispatch: AppDispatch }>('message/willBroadcastMessage', 
    async (message: string, {  dispatch, extra }: {extra: Dependencies, dispatch: AppDispatch}) => {
        const messageIdGenerator = extra.messageIdGenerator;
        const willGenerateMessageId = messageIdGenerator.generate();
        const willSendMessage : MessageEntity = {
            id: willGenerateMessageId,
            content: message,
            type: 'public',
            sentBy: 'audie',
        }
        dispatch(schedulingSendMessageAction(willSendMessage));
    });

export const schedulingSendMessageAction = createAction<MessageEntity>('message/schedulingSendMessage');