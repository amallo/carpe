import { MessageEntity } from '../store/message.slice';

/**
 * Mother Object for creating test messages
 * Provides predefined message instances for testing
 */
export class Message {
  /**
   * Returns a broadcasted public message
   */
  static broadcasted(params: {
    id: string;
    content: string;
    sentBy: string;
    sentAt: string;
  }): MessageEntity {
    return {
      id: params.id,
      content: params.content,
      channel: 'public',
      sentBy: params.sentBy,
      sentAt: params.sentAt,
    };
  }
}
