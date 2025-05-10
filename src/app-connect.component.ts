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

        .option i18n-img {
            max-width: 20%;
            max-height: 8em;
            float: right;
            margin: 0 0 0.5em 0.5em;
        }

        .centered {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
        }

        .state {
            font-size: 2rem;
        }
    `,
    template: html`
        <div *if="showConnect">
            <p><i18n-label id="appConnect.selectConnection"></i18n-label></p>

            <div class="option">
                <i18n-img
                    src="/votol-bluetooth-serial.png"
                    alt="appConnect.bluetoothImageAlt"
                ></i18n-img>

                <button @click="bluetoothConnect()">
                    <i18n-label id="appConnect.bluetoothConnect"></i18n-label>
                </button>

                <i18n-html id="appConnect.bluetoothDescriptionHtml"></i18n-html>
            </div>
            <div class="option">
                <i18n-img
                    src="/votol-usb-serial-can.png"
                    alt="appConnect.serialImageAlt"
                ></i18n-img>

                <button @click="serialConnect()">
                    <i18n-label id="appConnect.serialConnect"></i18n-label>
                </button>

                <i18n-html id="appConnect.serialDescriptionHtml"></i18n-html>
            </div>
            <div class="option">
                <i18n-img
                    src="/votol-usb-serial-black.png"
                    alt="appConnect.oldBlackSerialImageAlt"
                ></i18n-img>

                <i18n-html
                    id="appConnect.oldBlackSerialDescriptionHtml"
                ></i18n-html>
            </div>
            <div class="option">
                <i18n-img
                    src="/votol-usb-serial-blue.png"
                    alt="appConnect.oldBlueSerialImageAlt"
                ></i18n-img>

                <i18n-html
                    id="appConnect.oldBlueSerialDescriptionHtml"
                ></i18n-html>
            </div>
        </div>
        <div *if="bluetoothState !== BluetoothState.CLOSED" class="centered">
            <div
                *if="bluetoothState !== BluetoothState.RECONNECTING"
                class="state"
            >
                <div>
                    <i18n-label
                        id="appConnect.bluetoothState.{{bluetoothState}}"
                    ></i18n-label>
                </div>
                <button
                    *if="bluetoothState === BluetoothState.CONNECTED"
                    @click="bluetoothDisconnect()"
                >
                    Disconnect
                </button>
            </div>
        </div>
        <div *if="serialState !== SerialState.CLOSED" class="centered">
            <div class="state">
                <div>
                    <i18n-label
                        id="appConnect.serialState.{{serialState}}"
                    ></i18n-label>
                </div>
                <button
                    *if="serialState === SerialState.CONNECTED"
                    @click="serialDisconnect()"
                >
                    Disconnect
                </button>
            </div>
        </div>
    `,
})
export class AppConnectComponent {
    BluetoothState = BluetoothState;
    bluetoothState: BluetoothState = BluetoothState.CLOSED;
    SerialState = SerialState;
    serialState: SerialState = SerialState.CLOSED;
    showConnect = true;
    _bluetoothService = di(BluetoothService);
    _logService = di(LogService);
    _messageService = di(MessageService);
    _serialService = di(SerialService);
    _terminationSubject = new Subject<void>();

    constructor() {
        this._bluetoothService
            .state()
            .pipe(takeUntil(this._terminationSubject))
            .subscribe((state) => {
                this.bluetoothState = state;
                this._updateButtons();
            });
        this._serialService
            .state()
            .pipe(takeUntil(this._terminationSubject))
            .subscribe((state) => {
                this.serialState = state;
                this._updateButtons();
            });
    }

    onDestroy() {
        this._terminationSubject.next();
        this._terminationSubject.complete();
    }

    async bluetoothConnect() {
        this.showConnect = false;

        try {
            await this._bluetoothService.connect();
            this._logService.log('Connected to Bluetooth');
            this._messageService.open(this._bluetoothService);
        } catch (error) {
            this.showConnect = true;
            this._logService.log(`Failed to connect to Bluetooth: ${error}`);
        }
    }

    bluetoothDisconnect() {
        this._bluetoothService.disconnect();
        this._logService.log('Manually disconnected from Bluetooth');
    }

    async serialConnect() {
        this.showConnect = false;

        try {
            await this._serialService.connect();
            this._logService.log('Connected to serial port');
            this._messageService.open(this._bluetoothService);
        } catch (error) {
            this.showConnect = true;
            this._logService.log(`Failed to connect to serial port: ${error}`);
        }
    }

    serialDisconnect() {
        this._serialService.disconnect();
        this._logService.log('Manually disconnected from serial port');
    }

    _updateButtons() {
        this.showConnect =
            this.bluetoothState === BluetoothState.CLOSED &&
            this.serialState === SerialState.CLOSED;
    }
}
