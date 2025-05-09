import { Component, css, di, html } from 'fudgel';
import { UpdatePwaService } from './update-pwa.service';

@Component('update-pwa', {
    style: css`
        .load-svg-wrapper {
            padding: 0 3%;
            width: 5em;
            background-color: var(--bg-color);
        }

        .update-text {
            display: flex;
            justify-content: center;
            padding: 0 0.3em;
        }

        .space {
            min-width: 2em;
            flex-grow: 1;
        }

        .buttons {
            display: flex;
            justify-content: space-between;
        }

        .button {
            text-align: center;
        }

        .drawer {
            width: 100%;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
    `,
    template: html`
        <bottom-drawer #ref="drawer">
            <div class="drawer">
                <div class="update-text">
                    <i18n-label id="updatePwa.message"></i18n-label>
                </div>
                <div class="buttons">
                    <div class="button">
                        <styled-link @click.stop.prevent="reload()"
                            ><i18n-label id="updatePwa.reload"></i18n-label
                        ></styled-link>
                    </div>
                    <div class="space"></div>
                    <div class="button">
                        <styled-link @click.stop.prevent="skip()"
                            ><i18n-label id="updatePwa.skip"></i18n-label
                        ></styled-link>
                    </div>
                </div>
            </div>
        </bottom-drawer>
    `,
})
export class UpdatePwaComponent {
    private _updatePwaService = di(UpdatePwaService);
    drawer?: HTMLElement;

    onViewInit() {
        if (this.drawer) {
            (this.drawer as any).show();
        }
    }

    reload() {
        this._updatePwaService.performUpdate();
        this._callDrawer('hide');
    }

    private _callDrawer(action: 'show' | 'hide') {
        if (this.drawer) {
            (this.drawer as any)[action]();
        }
    }
}
