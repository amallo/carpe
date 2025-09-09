import { MessageIdGenerator } from "../message-id.generator";

export class SimpleMessageIdGenerator implements MessageIdGenerator {
    generate(): string {
        return `message-${Date.now()}`;
    }
}