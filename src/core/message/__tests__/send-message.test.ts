import { SendMessageFixture } from './send-message.fixture';
import { createStateBuilder } from '../../store/state.builder';
import { FakeMessageIdGenerator } from '../providers/infra/fake-message-id.generator';
import { FakeDateProvider } from '../../common/date/providers/infra/fake-date.provider';
import { Identity } from '../../identity/__tests__/identity.mother';
import { Message } from './message.mother';
import { Date } from '../../common/date/__tests__/date.mother';

/**
 * @jest-environment node
 */
describe('FEATURE: Audie broadcasts messages', () => {
    test('should broadcast a public message successfully', async () => {
        const initialState = createStateBuilder()
            .withCurrentIdentity(Identity.me())
            .withNoSubmittedMessages()
            .build();

        const messageIdGenerator = new FakeMessageIdGenerator();
        messageIdGenerator.willGenerate('message-1');

        const dateProvider = new FakeDateProvider();
        dateProvider.willGenerateNow(Date.nowValue());

        const initialStateBuilder = createStateBuilder(initialState);

        const fixture = new SendMessageFixture({
            messageIdGenerator,
            dateProvider,
        }, initialStateBuilder);

        await fixture.submitBroadcastMessage('Hello, world!');

        const expectedMessage = Message.broadcasted({
            id: 'message-1',
            content: 'Hello, world!',
            sentBy: Identity.me().id,
            sentAt: Date.nowValue(),
        });

        const expectedState = createStateBuilder()
            .withCurrentIdentity(Identity.me())
            .withNoSubmittedMessages()
            .withBroadcastedMessage(expectedMessage)
            .build();

        fixture
            .expectMessageWasSentWith(expectedMessage)
            .expectStateToEqual(expectedState);
    });
});
