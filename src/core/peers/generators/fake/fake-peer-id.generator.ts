import { PeerIdGenerator } from '../peer-id.generator';

export class FakePeerIdGenerator implements PeerIdGenerator {
    private _ids: string[] = [];
    sheduleNextId(id: string) {
        this._ids.push(id);
    }
    generate(): string {
        return this._ids.shift() || '';
    }
}
