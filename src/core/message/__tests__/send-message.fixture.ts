import { createTestStore, Store } from '../../../app/store/store';
import { createStateBuilder, StateBuilder } from '../../store/state.builder';
import { FakeDateProvider } from '../../common/date/providers/infra/fake-date.provider';
import { FakeMessageIdGenerator } from '../providers/infra/fake-message-id.generator';
import { FakeMessageProvider } from '../providers/infra/fake-message.provider';
import { submitMessage } from '../usecases/submit-message.usecase';
import { MessageEntity } from '../store/message.slice';
import { SendMessageRequest } from '../providers/message.provider';
import { appBecameForeground } from '../../app/store/app.slice';

/**
 * @jest-environment node
 */
export class SendMessageFixture {
  private messageProvider: FakeMessageProvider;
  private messageIdGenerator: FakeMessageIdGenerator;
  private dateProvider: FakeDateProvider;
  private stateBuilder: StateBuilder;
  private store?: Store; // Store created lazily

  constructor(
    dependencies: {
      messageProvider?: FakeMessageProvider;
      messageIdGenerator?: FakeMessageIdGenerator;
      dateProvider?: FakeDateProvider;
    } = {},
    initialStateBuilder?: StateBuilder
  ) {
    this.messageProvider = dependencies.messageProvider || new FakeMessageProvider();
    this.messageIdGenerator = dependencies.messageIdGenerator || new FakeMessageIdGenerator();
    this.dateProvider = dependencies.dateProvider || new FakeDateProvider();

    // Use provided StateBuilder or create a new one
    this.stateBuilder = initialStateBuilder || createStateBuilder();
    // Store created lazily when first action is called
    this.store = undefined;
  }

  withGeneratedMessageId(id: string): this {
    this.messageIdGenerator.willGenerate(id);
    return this;
  }

  withCurrentTime(time: string): this {
    this.dateProvider.willGenerateNow(time);
    return this;
  }


  withBroadcastedMessage(message: MessageEntity): this {
    this.stateBuilder.withBroadcastedMessage(message);
    return this;
  }

  /**
   * Get or create the store with configured initial state
   * Store is created lazily when first needed
   */
  private getOrCreateStore(): Store {
    if (!this.store) {
      const initialState = this.stateBuilder.build();
      this.store = createTestStore({
        messageProvider: this.messageProvider,
        messageIdGenerator: this.messageIdGenerator,
        dateProvider: this.dateProvider,
      }, initialState);
    }
    return this.store;
  }

  async submitMessage(content: string) {
    const store = this.getOrCreateStore();
    await store.dispatch(submitMessage(content)).unwrap();
    return this;
  }

  expectMessageWasSentWith(expectedMessage: SendMessageRequest) {
    expect(this.messageProvider.sendLastCall()).toEqual(expectedMessage);
    return this;
  }

  expectStateToEqual(expectedState: any): this {
    const store = this.getOrCreateStore();
    expect(store.getState()).toEqual(expectedState);
    return this;
  }

  getStore(): Store {
    return this.getOrCreateStore();
  }

  whenAppBecomesForegroundAt(time: string) {
    const store = this.getOrCreateStore();
    // Simulate app becoming foreground by dispatching the app state change
    // This should trigger the message processing middleware
    store.dispatch(appBecameForeground(time));
    return this;
  }
}
