import { DateProvider } from '../date.provider';

export class RealDateProvider implements DateProvider {
    now(): string {
        return new Date().toISOString();
    }
}