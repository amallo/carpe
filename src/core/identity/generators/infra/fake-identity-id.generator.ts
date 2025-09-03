import { IdentityIdGenerator, IdentityGenerationParam } from '../identity-id.generator';

export class FakeIdentityIdGenerator implements IdentityIdGenerator {
    private _ids: string[] = [];

    /**
     * Schedule the next ID to be generated
     * @param id - The ID to be returned on next generate() call
     */
    scheduleIdGenerated(id: string) {
        this._ids.push(id);
    }

    /**
     * Generate the next scheduled ID or empty string if none scheduled
     * @param _param - Parameters for identity generation (ignored in fake implementation)
     * @returns The next scheduled ID or empty string
     */
    generate(_param: IdentityGenerationParam): string {
        return this._ids.shift() || '';
    }
}
