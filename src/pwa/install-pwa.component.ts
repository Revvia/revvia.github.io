import { Component, css, di, html } from 'fudgel';
import { InstallPwaService } from './install-pwa.service';

@Component('install-pwa', {
    style: css`
        .load-svg-wrapper {
            padding: 0 3%;
            width: 5em;
            background-color: var(--bg-color);
        }

        .install-text {
            padding: 0 0.3em;
        }

        .space {
            flex-grow: 1;
        }

        @media (max-width: 60em) {
            .load-svg-wrapper {
                width: 4em;
            }
        }

        @media (max-width: 30em) {
            .load-svg-wrapper {
                width: 16%;
            }
        }

        @media (max-width: 20em) {
            .load-svg-wrapper {
                width: 25%;
            }
        }

        @media (max-width: 10em) {
            .load-svg-wrapper {
                width: 50%;
            }
        }
    `,
    template: html`
        <bottom-drawer #ref="drawer">
            <div class="load-svg-wrapper">
                <load-svg
                    href="/toolbox.svg"
                    @loadsvg.stop.prevent="logoLoaded()"
                ></load-svg>
            </div>
            <div class="install-text">
                <i18n-label id="installPwa.message"></i18n-label>
            </div>
            <div class="space"></div>
            <div class="install-button">
                <styled-link @click.stop.prevent="install()"
                    ><i18n-label id="installPwa.action"></i18n-label
                ></styled-link>
            </div>
        </bottom-drawer>
    `,
})
export class InstallPwaComponent {
    private _installPwaService = di(InstallPwaService);
    drawer?: HTMLElement;

    logoLoaded() {
        setTimeout(() => this._callDrawer('show'), 400);
    }

    install() {
        this._installPwaService.triggerSavedEvent();
        this._callDrawer('hide');
    }

    private _callDrawer(action: 'show' | 'hide') {
        if (this.drawer) {
            (this.drawer as any)[action]();
        }
    }
}
