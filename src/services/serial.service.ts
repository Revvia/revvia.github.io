import { BehaviorSubject, Subject } from 'rxjs';
import { di } from 'fudgel';
import { LogService } from './log.service';
import { MessageInterface } from './message.service';
import { map } from 'rxjs/operators';

export enum SerialState {
    CLOSED = 'CLOSED',
    CONNECTED = 'CONNECTED',
    OPEN = 'OPEN',
    PENDING = 'PENDING',
}

export class SerialService implements MessageInterface {
    private _logService = di(LogService);
    private _port: SerialPort | null = null;
    private _receive = new Subject<Uint8Array>();
    private _sendPromise = Promise.resolve();
    private _state = new BehaviorSubject(SerialState.CLOSED);
    private _writer: WritableStreamDefaultWriter<Uint8Array> | null = null;

    constructor() {
        if (this.supported()) {
            navigator.serial.addEventListener('connect', () => {
                this._logService.log('Serial port connected');
                this._state.next(SerialState.CONNECTED);
            });
            navigator.serial.addEventListener('disconnect', () => {
                this._logService.log('Serial port disconnected');
                this._state.next(SerialState.OPEN);
            });
        } else {
            this._logService.log('Serial not supported');
        }
    }

    async connect() {
        if (this._port || this._state.getValue() !== SerialState.CLOSED) {
            throw new Error('REV_8514 Already using a serial port');
        }

        this._state.next(SerialState.PENDING);

        try {
            this._logService.log('Requesting serial port');
            const port = await navigator.serial.requestPort();
            this._logService.log('Opening serial port');
            await port.open({ baudRate: 115200 });
            this._logService.log('Serial port opened');
            if (!port.writable) {
                this._logService.log('Port is not writable');
                return;
            }
            this._port = port;
            this._setupReader(port);
            this._setupWriter(port);
        } catch (error) {
            this._logService.log(`Error connecting to serial port: ${error}`);
            this.disconnect();
            throw error;
        }
    }

    async disconnect() {
        if (this._port) {
            if (this._writer) {
                this._logService.log('Releasing writer lock');
                this._writer.releaseLock();
                this._writer = null;
            }

            this._logService.log('Closing serial port');
            await this._port.close();
            this._port = null;
        }

        this._state.next(SerialState.CLOSED);
    }

    ready() {
        return this._state.asObservable().pipe(map((state => state === SerialState.OPEN)));
    }

    receive() {
        return this._receive.asObservable();
    }

    async sendBytes(data: Uint8Array) {
        if (!this._port?.writable) {
            this._logService.log('Serial port is not open');

            return;
        }

        this._sendPromise = this._sendPromise.then(() => this._send(data));

        return this._sendPromise;
    }

    state() {
        return this._state.asObservable();
    }

    supported() {
        return 'serial' in navigator;
    }

    async _send(data: Uint8Array) {
        if (!this._writer) {
            throw new Error('REV_8446 Writer is not available');
        }

        await this._writer.write(data);
    }

    async _setupReader(port: SerialPort) {
        this._logService.log('Setting up reader');
        while (this._port === port && port.readable) {
            const reader = port.readable.getReader();
            try {
                while (this._port === port) {
                    const { value, done } = await reader.read();

                    if (done) {
                        break;
                    }

                    this._receive.next(value);
                }
            } catch (error) {
                console.error('Error reading from port:', error);
            } finally {
                reader.releaseLock();
            }
        }
    }

    async _setupWriter(port: SerialPort) {
        this._logService.log('Setting up writer');

        if (!port.writable) {
            throw new Error('REV_4072 Port is not writable');
        }

        if (this._writer) {
            this._logService.log('Writer already exists');

            return;
        }

        this._writer = port.writable.getWriter();
    }
}
