export interface IdentityGenerationParam {
    nickname: string;
}

export interface IdentityIdGenerator {
    /**
     * Generate a unique identity ID
     * @param param - Parameters for identity generation
     * @returns A unique string identifier for the identity
     */
    generate(param: IdentityGenerationParam): string;
}
