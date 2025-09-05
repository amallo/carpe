import { createTestStore } from '../../../app/store/store';
import { FakeDateProvider } from '../../common/date/providers/infra/fake-date.provider';
import { createStateBuilder } from '../../store/state.builder';
import { FakeMessageIdGenerator } from '../providers/infra/fake-message-id.generator';
import { FakeMessageProvider } from '../providers/infra/fake-message.provider';
import { submitBroadcastMessage } from '../usecases/submit-broadcast-message.usecase';

describe('Audie broadcasts messages', () => {
    test('Audie broadcasts a public message successfully', async () => {
        const messageProvider = new FakeMessageProvider();
        const messageIdGenerator = new FakeMessageIdGenerator();
        messageIdGenerator.willGenerate('message-1');
        const dateProvider = new FakeDateProvider();
        dateProvider.willGenerateNow('2020-01-01T00:00:00.000Z');
        const initialState = createStateBuilder()
            .withCurrentIdentity({
                id: 'audie-id',
                nickname: 'audie',
                publicKey: 'public-key',
            })
            .withEmptyPendingMessages()
            .build();
        const store = createTestStore({ messageProvider, messageIdGenerator, dateProvider }, initialState);
        await store.dispatch(submitBroadcastMessage('Hello, world!' ));
        expect(messageProvider.sendWasCalledWith({
            id: 'message-1',
            content: 'Hello, world!',
            type: 'public',
            sentBy: 'audie-id',
            sentAt: '2020-01-01T00:00:00.000Z',
        })).toBe(true);
        const expectedState = createStateBuilder()
            .withCurrentIdentity({
                id: 'audie-id',
                nickname: 'audie',
                publicKey: 'public-key',
            })
            .withEmptyPendingMessages()
            .withBroadcastedMessage({
                id: 'message-1',
                content: 'Hello, world!',
                type: 'public',
                sentBy: 'audie-id',
                sentAt: '2020-01-01T00:00:00.000Z',
            })
            .build();
        expect(store.getState()).toEqual(expectedState);
    });

});
