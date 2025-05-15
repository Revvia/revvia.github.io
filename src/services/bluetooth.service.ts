import { BehaviorSubject, Subject } from 'rxjs';
import { di } from 'fudgel';
import { LogService } from './log.service';
import { MessageInterface } from './message.service';
import { map } from 'rxjs/operators';

export enum BluetoothState {
    CLOSED = 'CLOSED',
    CONNECTED = 'CONNECTED',
    CONNECTING = 'CONNECTING',
    PENDING = 'PENDING',
    RECONNECTING = 'RECONNECTING',
}

export class BluetoothService implements MessageInterface {
    private _characteristic: any | null = null;
    private _device: any | null = null;
    private _disconnectListener: (() => void) | null = null;
    private _logService = di(LogService);
    private _notificationsListener: (() => void) | null = null;
    private _receive = new Subject<Uint8Array>();
    private _sendPromise = Promise.resolve();
    private _state = new BehaviorSubject(BluetoothState.CLOSED);

    constructor() {
        if (!this.supported()) {
            this._logService.log('Bluetooth not supported');
            return;
        }
    }

    async connect() {
        if (this._device || this._state.getValue() !== BluetoothState.CLOSED) {
            throw new Error('REV_5970 Already using a Bluetooth device');
        }

        this._state.next(BluetoothState.PENDING);

        try {
            this._logService.log('Requesting Bluetooth device');
            this._device = await (navigator as any).bluetooth.requestDevice({
                filters: [{services: [0xffe0]}],
            });
            this._logService.log(`Device selected: ${this._device.name}`);
            this._state.next(BluetoothState.CONNECTING);
            await this._connectToDevice();
            this._setupNotificationsListener();
            this._state.next(BluetoothState.CONNECTED);
        } catch (error) {
            this._logService.log(`Error connecting to Bluetooth device: ${error}`);
            this.disconnect();
            this._state.next(BluetoothState.CLOSED);

            throw error;
        }
    }

    async disconnect() {
        if (this._device) {
            this._removeDisconnectListener();

            if (!this._device.gatt.connected) {
                this._logService.log('Device already disconnected');
            } else {
                this._logService.log('Disconnecting from GATT server');
                this._device.gatt.disconnect();
            }

            this._characteristic = null;
            this._device = null;
            this._state.next(BluetoothState.CLOSED);
        }
    }

    ready() {
        return this._state.asObservable().pipe(map((state => state === BluetoothState.CONNECTED)));
    }

    receive() {
        return this._receive.asObservable();
    }

    async sendBytes(data: Uint8Array) {
        if (!this._characteristic) {
            throw new Error('REV_3159 Not connected to a device');
        }

        // Can only send 20 bytes at a time.
        for (let i = 0; i < data.length; i += 20) {
            const chunk = data.slice(i, i + 20);
            this._sendPromise = this._sendPromise.then(() => this._send(chunk));
        }

        return this._sendPromise;
    }

    state() {
        return this._state.asObservable();
    }

    supported() {
        return 'bluetooth' in navigator;
    }

    async _connectToDevice() {
        if (this._device.gatt.connected && this._characteristic) {
            this._logService.log('Already connected to device');

            return this._characteristic;
        }

        this._logService.log('Connecting to Bluetooth device');
        this._setupDisconnectListener();
        this._logService.log('Connecting to GATT server');
        const server = await this._device.gatt.connect();
        this._logService.log('Getting service');
        const service = await server.getPrimaryService(0xffe0);
        this._logService.log('Getting characteristic');
        this._characteristic = await service.getCharacteristic(0xffe1);
    }

    _removeDisconnectListener() {
        if (this._disconnectListener) {
            this._logService.log('Removing disconnect listener');
            this._device.removeEventListener('gattserverdisconnected', this._disconnectListener);
            this._disconnectListener = null;
        }
    }

    _removeNotificationsListener() {
        if (this._notificationsListener) {
            this._logService.log('Removing notifications listener');
            this._characteristic.removeEventListener('characteristicvaluechanged', this._notificationsListener);
            this._notificationsListener = null;
        }
    }

    _send(chunk: Uint8Array) {
        if (!this._characteristic) {
            throw new Error('REV_8291 Incomplete send - no longer connected');
        }

        return this._characteristic.writeValue(chunk)
    }

    _setupDisconnectListener() {
        this._logService.log('Setting up disconnect listener');
        this._disconnectListener = async () => {
            try {
                this._logService.log('Bluetooth device disconnected, trying to reconnect');
                this._state.next(BluetoothState.RECONNECTING);
                await this._connectToDevice();
                this._setupNotificationsListener();
                this._state.next(BluetoothState.CONNECTED);
            } catch (error) {
                this._logService.log(`Error reconnecting to Bluetooth device: ${error}`);
                this.disconnect();
            }
        };
        this._device.addEventListener('gattserverdisconnected', this._disconnectListener);
    }

    _setupNotificationsListener() {
        this._removeNotificationsListener();
        this._logService.log('Starting notifications');
        this._characteristic.startNotifications();
        this._logService.log('Setting up notifications listener');
        const listener = (event: Event) => {
            const value = (event.target as any).getValue() as DataView;

            if (value) {
                const bytes = new Uint8Array(value.buffer);
                this._receive.next(bytes);
            }
        };
        this._characteristic.addEventListener('characteristicvaluechanged', listener);
    }
}
