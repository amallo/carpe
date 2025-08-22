export class CallTracker {
    private _callCount: number = 0;
    private _calls: unknown[] = [];
    methodWasCalled(): boolean {
        return this._callCount > 0;
    }
    recordCall<T>(param?: T): void {
        this._callCount++;
        this._calls.push(param);
    }
    wasCalledWith<T>(param: T): boolean {
        const paramString = JSON.stringify(param);
        return this._calls.some(call => JSON.stringify(call) === paramString);
    }
}
