import { nanoid } from 'nanoid';
import { MessageIdGenerator } from '../message-id.generator';

export class NanoIdMessageIdGenerator implements MessageIdGenerator {
    generate(): string {
        return nanoid();
    }
}
