import { Subject } from 'rxjs';

export class LogService {
    private _logs = new Subject<string>();
    private _recentLogs: string[] = [];
    private _startTime: number = Date.now();

    constructor() {
        this._logs.subscribe((message) => {
            console.log(message);
            this._recentLogs.push(message);

            if (this._recentLogs.length > 5000) {
                this._recentLogs.shift();
            }
        });
    }

    log(message: string) {
        const time = ((Date.now() - this._startTime) / 1000).toFixed(3);
        this._logs.next(`${time} ${message}`);
    }

    logSend(bytes: Uint8Array) {
        this.log(`SEND: ${this._toHex(bytes)}`);
    }

    logReceive(bytes: Uint8Array) {
        this.log(`RECV: ${this._toHex(bytes)}`);
    }

    recentLogs() {
        return [...this._recentLogs];
    }

    _toHex(bytes: Uint8Array) {
        return Array.from(bytes)
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join(' ');
    }
}
