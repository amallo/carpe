import { createTestStore } from '../../../app/store/store';
import { createStateBuilder } from '../../store/state.builder';
import { FakeMessageIdGenerator } from '../providers/infra/fake-message-id.generator';
import { FakeMessageProvider } from '../providers/infra/fake-message.provider';
import { scheduleBroadcastMessage } from '../usecases/schedule-broadcast-message.usecase';

describe('Audie broadcasts messages', () => {
    test('Audie broadcasts a public message successfully', async () => {
        const messageProvider = new FakeMessageProvider();
        const messageIdGenerator = new FakeMessageIdGenerator();
        messageIdGenerator.willGenerate('message-1');
        const store = createTestStore({ messageProvider, messageIdGenerator });
        await store.dispatch(scheduleBroadcastMessage('Hello, world!' ));
        const expectedState = createStateBuilder()
            .withEmptyPendingMessages()
            .withBroadcastedMessage({ id: 'message-1', content: 'Hello, world!', type: 'public', sentBy: 'audie'  })
            .build();
        expect(store.getState()).toEqual(expectedState);
    });
    
});
