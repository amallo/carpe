import { messageWasSubmitted } from '../usecases/submit-broadcast-message.usecase';
import { sendMessage } from '../usecases/send-message.usecase';
import { selectNextSubmittedMessage } from './message.slice';
import { startAppListening } from '../../../app/store/middlewares/listener.middleware';

export const listenToSendNextMessageOnMessageSubmitted = () => {
    startAppListening({
        actionCreator: messageWasSubmitted,
        effect: (_, { dispatch, getState }) => {
            const state = getState();
            const nextSubmittedMessage = selectNextSubmittedMessage(state);

            if (nextSubmittedMessage) {
                // Send the next message in the queue
                dispatch(sendMessage(nextSubmittedMessage.id));
            }
        },
    });
};
