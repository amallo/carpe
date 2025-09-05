import { messageWasSubmitted } from '../usecases/submit-broadcast-message.usecase';
import { sendMessage } from '../usecases/send-message.usecase';
import { selectNextSubmittedMessage } from './message.slice';

export const createSendNextMessageMiddleware = () => {
    return (store: any) => (next: any) => (action: any) => {
        const result = next(action);
        // Déclencher envoi quand nouveau message en queue
        if (messageWasSubmitted.match(action)) {
            return sendNextSubmittedMessage(store);
        }
        return result;
    };
};

export const sendNextSubmittedMessage = (store: any) => {
    const state = store.getState();
    const nextSubmittedMessage  = selectNextSubmittedMessage(state);
    store.dispatch(sendMessage(nextSubmittedMessage!.id));
};