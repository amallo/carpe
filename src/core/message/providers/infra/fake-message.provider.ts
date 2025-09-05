import { MessageProvider, SendMessageRequest } from '../message.provider';
import { CallTracker } from '../../../test/call-tracker';
export class FakeMessageProvider implements MessageProvider {
    private _sendMessageCallTracker = new CallTracker();
    send(message: SendMessageRequest): Promise<void> {
        console.log('send', message);
        this._sendMessageCallTracker.recordCall(message );
        return Promise.resolve();
    }
    sendWasCalledWith(message: SendMessageRequest): boolean {
        return this._sendMessageCallTracker.wasCalledWith(message);
    }
}
