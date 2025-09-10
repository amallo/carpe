import { Logger } from '../../../logger/providers/logger.interface';
import { MessageProvider, SendMessageRequest } from '../message.provider';

export class InMemoryMessageProvider implements MessageProvider {
  private messages: SendMessageRequest[] = [];

  constructor(private logger: Logger) {}

  async send(message: SendMessageRequest): Promise<void> {
    this.logger.info('InMemoryMessageProvider', `[InMemoryMessageProvider] Sending message: ${message.id}`);

    // Simulate network latency between 1 and 5 seconds
    const latency = Math.random() * 4000 + 1000; // 1000ms to 5000ms
    this.logger.info('InMemoryMessageProvider', `[InMemoryMessageProvider] Simulating ${latency.toFixed(0)}ms latency`);

    await new Promise(resolve => setTimeout(resolve, latency));

    // Store the message in memory
    this.messages.push(message);

    this.logger.info('InMemoryMessageProvider', `[InMemoryMessageProvider] Message ${message.id} sent successfully`);
  }

}
