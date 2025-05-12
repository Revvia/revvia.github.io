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
                justify-content: center;
                align-items: center;
            }

            .title {
                font-size: 1.6em;
            }

            color-scheme {
                position: absolute;
                top: 0;
                right: 0;
            }

            app-welcome {
                flex-grow: 1;
                flex-shrink: 1;
                overflow: hidden;
            }

            .content {
                flex: 1;
                overflow: hidden;
                display: flex;
                width: 100%;
            }

            .menu {
                width: var(--menu-width);
                flex: none;
            }

            @media (max-width: 600px) {
                .extended {
                    display: none;
                }

                .menu {
                    display: none;
                }
            }

            app-router {
                flex-grow: 1;
            }
        `,
        template: html`
            <header>
                <span class="title" title="{{hover}}"
                    >Revvia<span class="extended">
                        - Votol Controller Programmer</span
                    ></span
                >
                <color-scheme></color-scheme>
            </header>
            <app-welcome *if="!termsAccepted"></app-welcome>
            <div class="content" *if="termsAccepted">
                <menu-items class="menu"></menu-items>
                <app-router>
                    <div path="/about" component="app-about"></div>
                    <div path="/connect" component="app-connect"></div>
                    <div path="/settings" component="app-settings"></div>
                    <div path="**" component="app-redirect"></div>
                </app-router>
            </div>
            <flyout-menu></flyout-menu>
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
