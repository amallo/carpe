import { Dependencies } from '../../dependencies';
import { schedulingSendMessageAction } from '../usecases/schedule-broadcast-message.usecase';
import { sendMessage } from '../usecases/send-message.usecase';
import { selectNextPendingMessage } from './message.slice';

export const createSendNextMessageMiddleware = (dependencies: Dependencies) => {
    return (store: any) => (next: any) => (action: any) => {
        const result = next(action);
        // Déclencher envoi quand nouveau message en queue
        if (schedulingSendMessageAction.match(action)) {
            scheduleNextMessage(store, dependencies);
        }
        return result;
    };
};

export const scheduleNextMessage = (store: any, dependencies: Dependencies) => {
    const state = store.getState();
    const pendingMessage  = selectNextPendingMessage(state);
    store.dispatch(sendMessage(pendingMessage!.id));
};