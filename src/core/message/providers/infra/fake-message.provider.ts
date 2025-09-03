import { MessageProvider, SendMessageRequest } from '../message.provider';
import { CallTracker } from '../../../test/call-tracker';
export class FakeMessageProvider implements MessageProvider {
    private _broadcastMessageCallTracker = new CallTracker();
    private _sendMessageCallTracker = new CallTracker();
    broadcastMessage(message: string): Promise<void> {
        this._broadcastMessageCallTracker.recordCall({ message });
        return Promise.resolve();
    }
    send(message: SendMessageRequest): Promise<void> {
        this._sendMessageCallTracker.recordCall({ message });
        return Promise.resolve();
    }
}
