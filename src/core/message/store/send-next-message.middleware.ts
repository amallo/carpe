import { messageWasSubmitted } from '../usecases/submit-message.usecase';
import { sendMessage } from '../usecases/send-message.usecase';
import { startAppListening } from '../../../app/store/middlewares/listener.middleware';
import { selectNextSubmittedMessage } from './message.slice';
import { appBecameBackground, appBecameForeground } from '../../app/store/app.slice';

export const listeningSubmittedMessages = () => {
    startAppListening({
        actionCreator: messageWasSubmitted,
        effect: (_, { dispatch, getState }) => {
            const state = getState();
            const nextSubmittedMessage = selectNextSubmittedMessage(state);
            if (nextSubmittedMessage) {
                dispatch(sendMessage(nextSubmittedMessage.id));
            }
            //Promise.all(allSubmittedMessages.map(message => dispatch(sendMessage(message.id))));
        },
    });

    startAppListening({
        actionCreator: sendMessage.fulfilled,
        effect: (_, { dispatch, getState }) => {
            const state = getState();
            const nextSubmittedMessage = selectNextSubmittedMessage(state);
            if (nextSubmittedMessage) {
                dispatch(sendMessage(nextSubmittedMessage.id));
            }
            //Promise.all(allSubmittedMessages.map(message => dispatch(sendMessage(message.id))));
        },
    });
    startAppListening({
        actionCreator: appBecameForeground,
        effect: (_, { dispatch, getState }) => {
            const state = getState();
            const nextSubmittedMessage = selectNextSubmittedMessage(state);
            if (nextSubmittedMessage) {
                dispatch(sendMessage(nextSubmittedMessage.id));
            }
            //Promise.all(allSubmittedMessages.map(message => dispatch(sendMessage(message.id))));
        },
    });
};