import { BluetoothService, BluetoothState } from './services/bluetooth.service';
import { Component, css, di, html } from 'fudgel';
import { LogService } from './services/log.service';
import { MessageService } from './services/message.service';
import { SerialService, SerialState } from './services/serial.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component('app-connect', {
    style: css`
        :host {
            display: block;
            max-height: 100%;
            height: 100%;
            overflow: auto;
        }

        .option {
            clear: both;
        }

        .option img {
            max-width: 20%;
            max-height: 8em;
            float: right;
            margin: 0 0 0.5em 0.5em;
        }
    `,
    template: html`
        <p>Select the type of connection you want to use:</p>

        <div class="option">
            <img
                src="/votol-bluetooth-serial.png"
                alt="Bluetooth Serial Adapter"
            />

            <button disabled="{{disableButtons}}" @click="connectBluetooth()">
                Connect to Bluetooth Serial Port
            </button>

            <ul>
                <li>
                    Requires the Bluetooth adapter, which can come in a black or
                    a white case.
                </li>
                <li>Confirmed with EM200-2SP.</li>
                <li>
                    Should work with EM50-4, EM80GTSP (with CAN), EM100SP,
                    EM150-2SP, EM260SP, SV120 (with CAN).
                </li>
            </ul>
        </div>
        <div class="option">
            <img
                src="/votol-usb-serial-can.png"
                alt="USB to Serial CAN Adapter"
            />

            <button disabled="{{disableButtons}}" @click="connectSerialCan()">
                Connect to Serial Port (CAN)
            </button>

            <ul>
                <li>
                    Requires the USB to CAN adapter. It is blue with a band of
                    black electrical tape.
                </li>
                <li>Confirmed with EM200-2SP.</li>
                <li>
                    Should work with EM50-4, EM80GTSP (with CAN), EM100SP,
                    EM150-2SP, EM260SP, SV120 (with CAN).
                </li>
            </ul>
        </div>
        <div class="option">
            <img
                src="/votol-usb-serial-black.png"
                alt="USB to Serial Adapter"
            />
            <p>
                Unsupported controllers because they require the older serial
                adapter that's coated in black tape - they could be added in the
                future. This cable should support CAN.
            </p>
            <ul>
                <li>
                    EM50 (EM50S), EM100, EM100-4P, EM150 (EM150SP), EM200
                    (EM200SP).
                </li>
            </ul>
        </div>
        <div class="option">
            <img src="/votol-usb-serial-blue.png" alt="USB to Serial Adapter" />
            <p>
                Unsupported controllers that use the blue USB to serial adapter,
                which does not support CAN bus. These could also be added in the
                future.
            </p>
            <ul>
                <li>
                    EM25P, EM30SP, EM50SP LIN, EM50-4 (without CAN), EM50-6,
                    EM80GTSP (without CAN), SV120 (without CAN).
                </li>
            </ul>
        </div>
    `,
})
export class AppConnectComponent {
    disableButtons = false;
    _bluetoothService = di(BluetoothService);
    _bluetoothState: BluetoothState = BluetoothState.CLOSED;
    _logService = di(LogService);
    _messageService = di(MessageService);
    _serialService = di(SerialService);
    _serialState: SerialState = SerialState.CLOSED;
    _terminationSubject = new Subject<void>();

    constructor() {
        this._bluetoothService
            .state()
            .pipe(takeUntil(this._terminationSubject))
            .subscribe((state) => {
                this._bluetoothState = state;
                this._updateButtons();
            });
        this._serialService
            .state()
            .pipe(takeUntil(this._terminationSubject))
            .subscribe((state) => {
                this._serialState = state;
                this._updateButtons();
            });
    }

    onDestroy() {
        this._terminationSubject.next();
        this._terminationSubject.complete();
    }

    async connectBluetooth() {
        this.disableButtons = true;

        try {
            await this._bluetoothService.connect();
            this._logService.log('Connected to Bluetooth');
            this._messageService.open(this._bluetoothService);
        } catch (error) {
            this.disableButtons = false;
            this._logService.log(`Failed to connect to Bluetooth: ${error}`);
        }
    }

    async connectSerialCan() {
        this.disableButtons = true;

        try {
            await this._serialService.connect();
            this._logService.log('Connected to serial port');
            this._messageService.open(this._bluetoothService);
        } catch (error) {
            this.disableButtons = false;
            this._logService.log(`Failed to connect to serial port: ${error}`);
        }
    }

    _updateButtons() {
        this.disableButtons =
            this._bluetoothState !== BluetoothState.CLOSED ||
            this._serialState !== SerialState.CLOSED;
    }
}
