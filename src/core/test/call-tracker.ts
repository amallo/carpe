export class CallTracker {
    private _callCount: number = 0;
    private _calls: any[] = [];
    methodWasCalled(): boolean {
        return this._callCount > 0;
    }
    recordCall(param?: any): void {
        this._callCount++;
        this._calls.push(param);
    }
    wasCalledWith(param: any): boolean {
        return this._calls.includes(param);
    }
}
