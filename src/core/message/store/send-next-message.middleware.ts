import { messageWasSubmitted } from '../usecases/submit-message.usecase';
import { sendMessage } from '../usecases/send-message.usecase';
import { selectAllSubmittedMessages } from './message.slice';
import { startAppListening } from '../../../app/store/middlewares/listener.middleware';

export const listeningSubmittedMessages = () => {
    startAppListening({
        actionCreator: messageWasSubmitted,
        effect: (_, { dispatch, getState }) => {
            const state = getState();
            const allSubmittedMessages = selectAllSubmittedMessages(state);
            Promise.all(allSubmittedMessages.map(message => dispatch(sendMessage(message.id))));
        },
    });
};