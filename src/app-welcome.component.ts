import { Component, css, di, html } from 'fudgel';
import { SessionStorageService, TERMS_ACCEPTED } from './services/session-storage.service';

@Component('app-welcome', {
    style: css`
        :host {
            display: flex;
            flex-direction: column;
            max-height: 100%;
            height: 100%;
        }

        .fit {
            flex-grow: 1;
            flex-shrink: 1;
            overflow: auto;
            padding: 1rem;
            margin: 1rem;
            border: 2px solid var(--active-background-color);
            border-radius: 0.5rem;
        }

        h1 {
            margin-top: 0;
        }

        .accept {
            font-size: 2rem;
            display: flex;
            align-items: center;
            flex-direction: column;
        }

        button {
            font: inherit;
            border-radius: 0.5rem;
            margin: 0 1rem 1rem 1rem;
        }

        .supported,
        .unsupported {
            font-size: 1.5rem;
            font-weight: bold;
            padding: 1rem;
            border-radius: 0.5rem;
        }

        .supported {
            background-color: #00af00;
        }

        .unsupported {
            background-color: red;
        }
    `,
    template: html`
        <div class="fit">
            <h1><i18n-label id="welcome.title"></i18n-label></h1>

            <i18n-html id="welcome.overviewHtml"></i18n-html>

            <p>
                <check-or-x checked="{{supportsBluetooth}}"></check-or-x>
                <i18n-label id="welcome.supportsBluetooth"></i18n-label>
                <br />
                <check-or-x checked="{{supportsSerial}}"></check-or-x>
                <i18n-label id="welcome.supportsSerial"></i18n-label>
            </p>

            <p *if="supported" class="supported">
                <i18n-label id="welcome.browserSupported"></i18n-label>
            </p>

            <p *if="!supported" class="unsupported">
                <i18n-label id="welcome.browserUnsupported"></i18n-label>
            </p>

            <i18n-html id="welcome.pleaseHelpHtml"></i18n-html>

            <i18n-html id="welcome.termsOfUseHtml"></i18n-html>
        </div>
        <div class="accept">
            <button disabled="{{!supported}}" @click="accept()">
                <i18n-label id="welcome.acceptTerms"></i18n-label>
            </button>
        </div>
    `,
})
export class AppWelcomeComponent {
    supported = false;
    supportsBluetooth = false;
    supportsSerial = false;
    private readonly _sessionStorageService = di(SessionStorageService);

    constructor() {
        if ('bluetooth' in navigator) {
            this.supportsBluetooth = true;
        }

        if ('serial' in navigator) {
            this.supportsSerial = true;
        }

        this.supported = this.supportsBluetooth || this.supportsSerial;
    }

    accept() {
        this._sessionStorageService.set(TERMS_ACCEPTED, true);
    }
}
