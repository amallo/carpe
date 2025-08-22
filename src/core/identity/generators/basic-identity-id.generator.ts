import { IdentityIdGenerator, IdentityGenerationParam } from './identity-id.generator';

export class BasicIdentityGenerator implements IdentityIdGenerator {
    private counter = 0;

    generate(_param: IdentityGenerationParam): string {
        this.counter++;
        return `identity-${this.counter}`;
    }
}
