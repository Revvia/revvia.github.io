import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { di } from 'fudgel';
import { LogService } from './log.service';

export enum MessageState {
    CLOSED = 'CLOSED',
    OPEN = 'OPEN',
}

export interface MessageInterface {
    disconnect(): void;
    ready(): Observable<boolean>;
    receive(): Observable<Uint8Array>;
    sendBytes(bytes: Uint8Array): void;
}

const startTime = Date.now();

export class MessageService {
    private _interface: MessageInterface | null = null;
    private _logService = di(LogService);
    private _messages: string[] = [];
    private _receiveBuffer: number[] = [];
    private _state = new BehaviorSubject(MessageState.CLOSED);
    private _subject = new Subject<number[]>();

    close() {
        if (!this._interface) {
            throw new Error('REV_7636 Interface already closed');
        }

        this._interface.disconnect();
    }

    listen() {
        return this._subject.asObservable();
    }

    logs() {
        return [...this._messages];
    }

    open(iface: MessageInterface) {
        if (this._interface) {
            throw new Error('REV_1140 Interface already open');
        }

        this._interface = iface;
        const subscription = iface.ready().subscribe((readyState) => {
            if (readyState) {
                iface.receive().subscribe((bytes) => this._receiveBytes(bytes));
                this._state.next(MessageState.OPEN);
            } else {
                this._state.next(MessageState.CLOSED);
                subscription.unsubscribe();
                this._flush();

                if (this._interface === iface) {
                    this._interface = null;
                }
            }
        });
    }

    // Pass in the 20-byte message payload. Wrap with extra 4 bytes and send to
    // the interface.
    sendMessage(bytes: Uint8Array) {
        if (!this._interface) {
            throw new Error('REV_9082 Interface not open');
        }

        if (bytes.length !== 20) {
            throw new Error('REV_2548 Message must be 20 bytes');
        }

        const fullMessage = new Uint8Array(24);
        fullMessage[0] = 0xc9; // Send
        fullMessage[1] = 0x14; // Length, 0x14 = 20
        fullMessage.set(bytes, 2);
        let checksum = 0;

        for (let i = 0; i < 22; i += 1) {
            checksum ^= fullMessage[i];
        }

        fullMessage[22] = checksum;
        fullMessage[23] = 0x0d; // End

        this._logBytes('SEND', fullMessage);
        this._logMessage('SEND', fullMessage);
        this._interface.sendBytes(fullMessage);
    }

    state() {
        return this._state.asObservable();
    }

    _bytesToHex(bytes: Uint8Array | number[]): string {
        return Array.from(bytes)
            .map((byte) => byte.toString(16).padStart(2, '0'))
            .join(' ');
    }

    _flush() {
        this._receiveBuffer.length = 0;
    }

    _logBytes(direction: string, bytes: Uint8Array | number[]) {
        this._logService.log(`${direction}: ${this._bytesToHex(bytes)}`);
    }

    _logMessage(direction: string, bytes: Uint8Array | number[]) {
        this._messages.push(
            `${Date.now() - startTime},${direction},${this._bytesToHex(bytes)}`
        );

        while (this._messages.length > 5000) {
            this._messages.shift();
        }
    }

    _messageCheck(message: number[]) {
        // Look for length of payload
        if (message[1] !== 0x14) {
            return 'Length mismatch';
        }

        // Look for end of message tag
        if (message[23] !== 0x0d) {
            return 'End byte mismatch';
        }

        // Verify checksum
        let checksum = 0;

        for (let i = 0; i < 22; i += 1) {
            checksum ^= message[i];
        }

        if (checksum !== message[22]) {
            return `Checksum ${this._bytesToHex([checksum])} mismatch`;
        }

        return false;
    }

    _receiveBytes(bytes: Uint8Array | number[]): void {
        this._logBytes('RECV', bytes);
        this._receiveBuffer.push(...bytes);
        const discard: number[] = [];

        while (this._receiveBuffer.length && this._receiveBuffer[0] !== 0xc0) {
            discard.push(this._receiveBuffer.shift()!);
        }

        if (discard.length) {
            this._logService.log(
                `Discarding bytes: ${this._bytesToHex(discard)}`
            );
        }

        while (this._receiveBuffer.length >= 24) {
            const message = this._receiveBuffer.slice(0, 24);
            const problem = this._messageCheck(message);

            if (problem) {
                this._logService.log(
                    `Skipping only first byte - ${problem}: ${this._bytesToHex(this._receiveBuffer.slice(0, 24))}`
                );
                this._receiveBuffer.shift();

                return this._receiveBytes([]);
            }

            // Message could be valid.
            this._receiveBuffer.splice(0, 24);
            this._receiveMessage(message);
        }

        if (this._receiveBuffer.length) {
            return this._receiveBytes([]);
        }
    }

    _receiveMessage(message: number[]) {
        this._logMessage('RECV', message);

        // Remove envelope
        const payload = message.slice(2, 20);
        this._subject.next(payload);
    }
}
