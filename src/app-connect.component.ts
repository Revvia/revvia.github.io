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
            box-sizing: border-box;
            display: block;
            height: 100%;
            max-height: 100%;
            overflow: auto;
            padding: 0.5em;
        }

        .option {
            display: flex;
            gap: 1em;
            margin-bottom: 1em;
        }

        .option img {
            max-width: 20%;
            width: 8em;
            overflow: hidden;
            box-sizing: border-box;
            object-fit: contain;
            flex: none;
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
        <page-title id="connect.title"></page-title>
        <div *if="showConnect">
            <p><i18n-label id="connect.selectConnection"></i18n-label></p>

            <div class="option">
                <img
                    src="/votol-bluetooth-serial.png"
                    #i18n-alt="connect.bluetoothImageAlt"
                />

                <div>
                    <button @click="bluetoothConnect()">
                        <i18n-label id="connect.bluetoothConnect"></i18n-label>
                    </button>

                    <div class="unsupported" *if="!bluetoothSupported">
                        <i18n-label
                            id="connect.bluetoothUnsupported"
                        ></i18n-label>
                    </div>

                    <i18n-html
                        id="connect.bluetoothDescriptionHtml"
                    ></i18n-html>
                </div>
            </div>
            <div class="option">
                <img
                    src="/votol-usb-serial-can.png"
                    #i18n-alt="connect.serialImageAlt"
                />

                <div>
                    <button *if="serialSupported" @click="serialConnect()">
                        <i18n-label id="connect.serialConnect"></i18n-label>
                    </button>

                    <div class="unsupported" *if="!serialSupported">
                        <i18n-label id="connect.serialUnsupported"></i18n-label>
                    </div>

                    <i18n-html id="connect.serialDescriptionHtml"></i18n-html>
                </div>
            </div>
            <div class="option">
                <img
                    src="/votol-usb-serial-black.png"
                    #i18n-alt="connect.oldBlackSerialImageAlt"
                />

                <div>
                    <i18n-html
                        id="connect.oldBlackSerialDescriptionHtml"
                    ></i18n-html>
                </div>
            </div>
            <div class="option">
                <img
                    src="/votol-usb-serial-blue.png"
                    #i18n-alt="connect.oldBlueSerialImageAlt"
                />

                <div>
                    <i18n-html
                        id="connect.oldBlueSerialDescriptionHtml"
                    ></i18n-html>
                </div>
            </div>
        </div>
        <div *if="bluetoothState !== BluetoothState.CLOSED" class="centered">
            <i18n-label
                class="state"
                id="connect.bluetoothState.{{bluetoothState}}"
            ></i18n-label>
            <connection-operations
                *if="bluetoothState === BluetoothState.CONNECTED"
            ></connection-operations>
        </div>
        <div *if="serialState !== SerialState.CLOSED" class="centered">
            <i18n-label
                class="state"
                id="connect.serialState.{{serialState}}"
            ></i18n-label>
            <connection-operations
                *if="serialState === SerialState.CONNECTED"
            ></connection-operations>
        </div>
    `,
})
export class AppConnectComponent {
    BluetoothState = BluetoothState;
    bluetoothState = BluetoothState.CLOSED;
    bluetoothSupported = false;
    SerialState = SerialState;
    serialState = SerialState.CLOSED;
    serialSupported = false;
    showConnect = true;
    private readonly _bluetoothService = di(BluetoothService);
    private readonly _logService = di(LogService);
    private readonly _messageService = di(MessageService);
    private readonly _serialService = di(SerialService);
    private readonly _terminationSubject = new Subject<void>();

    constructor() {
        this.bluetoothSupported = this._bluetoothService.supported();
        this._bluetoothService
            .state()
            .pipe(takeUntil(this._terminationSubject))
            .subscribe((state) => {
                this.bluetoothState = state;
                this._updateButtons();
            });
        this.serialSupported = this._serialService.supported();
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
