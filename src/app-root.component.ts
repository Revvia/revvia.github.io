import { component, css, di, html } from 'fudgel';
import {
    SessionStorageService,
    TERMS_ACCEPTED,
} from './services/session-storage.service';

component(
    'app-root',
    {
        style: css`
            :host {
                display: flex;
                flex-direction: column;
                max-height: 100%;
                height: 100%;
                width: 100%;
            }

            header {
                flex: none;
                background-color: var(--active-background-color);
                display: flex;
                justify-content: space-between;
            }

            app-welcome, app-router {
                flex-grow: 1;
                flex-shrink: 1;
                overflow: hidden;
            }
        `,
        template: html`
            <header>
                <span title="{{hover}}"
                    >Revvia - Votol Controller Programmer</span
                >

                <color-scheme></color-scheme>
            </header>
            <app-welcome *if="!termsAccepted"></app-welcome>
            <app-router *if="termsAccepted">
                <div path="/connect" component="app-connect"></div>
                <div path="**" component="app-redirect"></div>
            </app-router>
        `,
    },
    class {
        hover = '';
        termsAccepted = false;
        private readonly _sessionStorageService = di(SessionStorageService);

        constructor() {
            const hover = [];
            hover.push(
                `Last Update: ${__BUILD_DATE__.substr(0, 16).replace('T', ' ')}`
            );
            this.hover = hover.join('\n');
            this._sessionStorageService
                .observe(TERMS_ACCEPTED)
                .subscribe((value: boolean) => {
                    this.termsAccepted = !!value;
                });
        }
    }
);
