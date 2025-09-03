import { MessageIdGenerator } from '../message-id.generator';

export class FakeMessageIdGenerator implements MessageIdGenerator {
    private _ids: string[] = [];
    generate(): string {
        return this._ids.shift() || '';
    }

    willGenerate(id: string) {
        this._ids.push(id);
    }
}