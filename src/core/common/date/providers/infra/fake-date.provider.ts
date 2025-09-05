import { DateProvider } from '../date.provider';

export class FakeDateProvider implements DateProvider {
    private _dates: string[] = [];
    now(): string {
        return this._dates.shift() || '';
    }
    willGenerateNow(date: string) {
        this._dates.push(date);
    }
}