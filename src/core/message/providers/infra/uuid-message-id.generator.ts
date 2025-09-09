import { v4 as uuidv4 } from 'uuid';
import { MessageIdGenerator } from '../message-id.generator';

export class UUIdMessageIdGenerator implements MessageIdGenerator {
    generate(): string {
        return `${uuidv4()}`;
    }
}
