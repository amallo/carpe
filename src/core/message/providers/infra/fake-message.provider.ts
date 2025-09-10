import { MessageProvider, SendMessageRequest } from '../message.provider';
import { CallTracker } from '../../../test/call-tracker';
export class FakeMessageProvider implements MessageProvider {
    private _sendMessageCallTracker = new CallTracker();
    send(message: SendMessageRequest): Promise<void> {
        this._sendMessageCallTracker.recordCall(message );
        return Promise.resolve();
    }
    sendLastCall() {
        return this._sendMessageCallTracker.lastCall();
    }
}
