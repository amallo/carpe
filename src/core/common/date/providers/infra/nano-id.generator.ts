import { IdGenerator } from '../id.generator';
import { nanoid } from 'nanoid';

export class NanoIdGenerator implements IdGenerator {
  generate(): string {
    return nanoid();
  }
}