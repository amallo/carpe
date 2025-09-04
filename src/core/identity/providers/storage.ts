


export interface Storage<T> {
    store(key: string, keyPair: T): Promise<void>;
    retrieve(key: string): Promise<T | null>;
}
