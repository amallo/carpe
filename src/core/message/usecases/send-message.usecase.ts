import { createAsyncThunk } from '@reduxjs/toolkit';
import { Dependencies } from '../../dependencies';
import { RootState } from '../../../app/store/store';
import { selectSubmittedMessageById } from '../store/message.slice';

export const sendMessage = createAsyncThunk<void, string, { extra: Dependencies, getState: () => RootState }>('message/sendMessage',
    async (messageId: string, { extra, getState }) => {
        const messageProvider = extra.messageProvider;
        const state = getState();
        const meesageReadyToSend = selectSubmittedMessageById(state, messageId);


        await messageProvider.send(meesageReadyToSend!);
    }
);
