export class CallTracker {
    private _callCount: number = 0;
    methodWasCalled(): boolean {
        return this._callCount > 0;
    }
    recordCall(): void {
        this._callCount++;
    }
}
